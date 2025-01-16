import http from "../../http";

export const getTransactionListRequest = async ({
  url,
  headers,
}: {
  url: string;
  headers: any;
}) => {
  const response = await http({
    method: "get",
    url,
    headers,
  });

  return response;
};

export const updateTransaction = async (
  url: string,
  {
    arg,
  }: {
    arg: {
      id: string;
      type: string;
      value: number;
    };
  }
) => {
  await http({
    method: "PUT",
    url: `${url}/${arg.id}`,
    data: JSON.stringify(arg),
  });
};

export const deleteTransaction = async (
  url: string,
  {
    arg,
  }: {
    arg: {
      id: string;
    };
  }
) => {
  await http({
    method: "DELETE",
    url: `${url}/${arg.id}`,
  });
};
