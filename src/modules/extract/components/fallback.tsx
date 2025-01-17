import { Typography } from "@mui/material";
import { Card } from "fiap-financeiro-ds";

interface ComponentFallBackProps {
  message: string;
}
export function ComponentFallBack({ message }: ComponentFallBackProps) {
  return (
    <Card type="default" sx={{ width: "282px" }}>
      <Typography variant="h5" sx={{ marginBottom: "16px" }}>
        Extrato
      </Typography>
      {message}
    </Card>
  );
}
