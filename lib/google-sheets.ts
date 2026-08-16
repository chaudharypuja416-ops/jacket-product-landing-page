import { google } from "googleapis";
import type { CompleteOrder } from "@/lib/order-schema";

const columns = [
  "Order ID",
  "Date & Time",
  "Customer Name",
  "Phone Number",
  "Email Address",
  "Exact Location",
  "Product Name",
  "Color",
  "Size",
  "Quantity",
  "Price Per Piece",
  "Total Price",
  "Payment Method",
  "Order Status",
  "Notes",
];

const statusOptions = [
  "New Order",
  "Order Confirmed",
  "Order Ongoing",
  "Delivered",
  "Cancelled",
];

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function sheetRange(tabName: string, range: string) {
  const escaped = tabName.replace(/'/g, "''");
  return `'${escaped}'!${range}`;
}

async function getOrCreateSheetId(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string,
  tabName: string,
) {
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets(properties(sheetId,title))",
  });
  const normalizedTabName = tabName.trim().toLowerCase();
  const sheet = spreadsheet.data.sheets?.find(
    (entry) => entry.properties?.title?.trim().toLowerCase() === normalizedTabName,
  );

  if (sheet?.properties?.sheetId != null) {
    return sheet.properties.sheetId;
  }

  const created = await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          addSheet: {
            properties: {
              title: tabName,
              gridProperties: {
                frozenRowCount: 1,
              },
              tabColor: {
                red: 0.13,
                green: 0.09,
                blue: 0.07,
              },
            },
          },
        },
      ],
    },
  });

  const sheetId = created.data.replies?.[0]?.addSheet?.properties?.sheetId;
  if (sheetId == null) {
    throw new Error(`Unable to create Google Sheet tab: ${tabName}`);
  }

  return sheetId;
}

async function styleOrderSheet(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string,
  sheetId: number,
) {
  const statusColumnIndex = columns.indexOf("Order Status");
  const moneyColumnStart = columns.indexOf("Price Per Piece");
  const moneyColumnEnd = columns.indexOf("Total Price") + 1;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          updateSheetProperties: {
            properties: {
              sheetId,
              gridProperties: {
                frozenRowCount: 1,
              },
              tabColor: {
                red: 0.13,
                green: 0.09,
                blue: 0.07,
              },
            },
            fields: "gridProperties.frozenRowCount,tabColor",
          },
        },
        {
          repeatCell: {
            range: {
              sheetId,
              startRowIndex: 0,
              endRowIndex: 1,
              startColumnIndex: 0,
              endColumnIndex: columns.length,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: {
                  red: 0.13,
                  green: 0.09,
                  blue: 0.07,
                },
                horizontalAlignment: "CENTER",
                verticalAlignment: "MIDDLE",
                textFormat: {
                  foregroundColor: {
                    red: 1,
                    green: 0.98,
                    blue: 0.94,
                  },
                  fontSize: 10,
                  bold: true,
                },
              },
            },
            fields:
              "userEnteredFormat(backgroundColor,horizontalAlignment,verticalAlignment,textFormat)",
          },
        },
        {
          repeatCell: {
            range: {
              sheetId,
              startRowIndex: 1,
              startColumnIndex: 0,
              endColumnIndex: columns.length,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: {
                  red: 1,
                  green: 0.98,
                  blue: 0.95,
                },
                verticalAlignment: "MIDDLE",
                wrapStrategy: "WRAP",
                textFormat: {
                  foregroundColor: {
                    red: 0.13,
                    green: 0.09,
                    blue: 0.07,
                  },
                  fontSize: 10,
                },
              },
            },
            fields:
              "userEnteredFormat(backgroundColor,verticalAlignment,wrapStrategy,textFormat)",
          },
        },
        {
          repeatCell: {
            range: {
              sheetId,
              startRowIndex: 1,
              startColumnIndex: moneyColumnStart,
              endColumnIndex: moneyColumnEnd,
            },
            cell: {
              userEnteredFormat: {
                numberFormat: {
                  type: "CURRENCY",
                  pattern: '"NPR" #,##0',
                },
              },
            },
            fields: "userEnteredFormat.numberFormat",
          },
        },
        {
          repeatCell: {
            range: {
              sheetId,
              startRowIndex: 1,
              startColumnIndex: statusColumnIndex,
              endColumnIndex: statusColumnIndex + 1,
            },
            cell: {
              dataValidation: {
                condition: {
                  type: "ONE_OF_LIST",
                  values: statusOptions.map((option) => ({
                    userEnteredValue: option,
                  })),
                },
                showCustomUi: true,
                strict: true,
              },
            },
            fields: "dataValidation",
          },
        },
        {
          setBasicFilter: {
            filter: {
              range: {
                sheetId,
                startRowIndex: 0,
                startColumnIndex: 0,
                endColumnIndex: columns.length,
              },
            },
          },
        },
        {
          autoResizeDimensions: {
            dimensions: {
              sheetId,
              dimension: "COLUMNS",
              startIndex: 0,
              endIndex: columns.length,
            },
          },
        },
        {
          updateDimensionProperties: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex: 0,
              endIndex: 1,
            },
            properties: {
              pixelSize: 42,
            },
            fields: "pixelSize",
          },
        },
      ],
    },
  });
}

export async function appendOrderToSheet(order: CompleteOrder) {
  const spreadsheetId = requiredEnv("GOOGLE_SHEET_ID");
  const clientEmail = requiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKey = requiredEnv("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n");
  const tabName = process.env.GOOGLE_SHEET_TAB_NAME || "Sheet1";

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const sheetId = await getOrCreateSheetId(sheets, spreadsheetId, tabName);

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: sheetRange(tabName, "A1:O1"),
    valueInputOption: "RAW",
    requestBody: {
      values: [columns],
    },
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: sheetRange(tabName, "A:O"),
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
          order.orderId,
          order.dateTime,
          order.customerName,
          order.phone,
          order.email,
          order.location,
          order.productName,
          order.selectedColor,
          order.selectedSize,
          order.quantity,
          order.pricePerPiece,
          order.totalPrice,
          order.paymentMethod,
          order.orderStatus,
          order.notes,
        ],
      ],
    },
  });

  await styleOrderSheet(sheets, spreadsheetId, sheetId);
}
