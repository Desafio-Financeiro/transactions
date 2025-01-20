import http from "../../http";

export const balanceRequest = async (url: string) => {
  const response = await http({
    method: "get",
    url,
  });

  return response;
};
