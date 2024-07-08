const API_URL = "/api";

interface Institution {
  _id: string;
  name: string;
  fullName: string;
  countries: {
    displayName: string;
    countryCode2: string;
  }[];
  environmentType: string;
  credentialsType: string;
  media: {
    source: string;
    type: string;
  }[];
  features: string[];
}

export const getBankInstitutions = async (
  institutionId: string
): Promise<Institution> => {
  const response = await fetch(
    `${API_URL}/v1/banking/institutions/${institutionId}`
  );
  return response.json();
};

export interface Account {
  id: string;
  type: string;
  balance: number;
  currency: string;
  usageType: string;
  accountType: string;
  nickname: string;
  accountNames: Array<{
    name: string;
  }>;
  accountIdentifications: Array<{
    type: string;
    identification: string;
  }>;
}

export const getBankAccounts = async (): Promise<Account[]> => {
  const response = await fetch(
    `${API_URL}/v1/banking/accounts?consentId=56a42244-414a-4b52-8c4f-4ad2a50e82fe`
  );
  return response.json();
};

type RegisterBankAccountRequest = {
  openBankingId: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
};

const registerBankAccount = async (
  account: RegisterBankAccountRequest
): Promise<void> => {
  try {
    const response = await fetch(
      `${API_URL}/v1/accounts?consentId=56a42244-414a-4b52-8c4f-4ad2a50e82fe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(account),
      }
    );

    if (!response.ok) {
      throw new Error(`An error has occurred: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const batchRegisterBankAccounts = async (
  accounts: RegisterBankAccountRequest[]
): Promise<void> => {
  try {
    await Promise.all(accounts.map(registerBankAccount));
  } catch (error) {
    console.error(error);
    throw error;
  }
};
