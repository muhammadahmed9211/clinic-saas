export interface IBridgerPayCreate {
  order_id: string; // Assuming transaction.id is a number
  email?: string | null; // '?' denotes that the property is optional
  single_payment_method: string;
  theme: string;
  payload: string;
  cashier_key: string;
  currency: string;
  country: string;
  amount: number; // Assuming amount is a number

  currency_lock: boolean;
  amount_lock: boolean;
  hide_card_holder_name_when_full_name_is_available: boolean;

  first_name: string;
  last_name: string;
  city: string;
  state?: string | null; // '?' denotes that the property is optional

  address?: string; // Optional if billingDetails.address may not exist
  zip_code: string;

  button_mode: string;
  deposit_button_text: string;
  button_text: string;
}
