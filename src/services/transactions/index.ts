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
      data: {
        userId: string;
        id: string;
        type: string;
        value: number;
        createdAt: string;
      };
    };
  }
) => {
  await http({
    method: "PUT",
    url: `${url}/${arg.data.id}`,
    data: {
      userId: arg.data.userId,
      type: arg.data.type,
      value: arg.data.value,
      createdAt: arg.data.createdAt,
    },
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
