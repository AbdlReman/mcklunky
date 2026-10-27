/** Labels for stored payment method codes (orders, emails, admin). */
export function paymentMethodLabel(code: string): string {
  switch ((code || "").toLowerCase()) {
    case "banktransfer":
      return "Bank Transfer";
    case "paypal":
      return "PayPal";
    case "card":
      return "Card Payment";
    case "easypaisa":
      return "EasyPaisa";
    case "sadapay":
      return "Sada Pay";
    case "meezan":
      return "Meezan Bank";
    case "jazzcash":
      return "JazzCash";
    case "mcbislamic":
      return "MCB Islamic Bank";
    default:
      return (code || "").trim() || "—";
  }
}
