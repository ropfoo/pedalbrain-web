import { useSubmit } from "@remix-run/react";

export default function Test({ id }: { id: string }) {
  const submit = useSubmit();

  return (
    <div
      onClick={() => {
        submit(
          {
            id: "myform",
            name: "_action",
            value: "updatePedal",
          },
          {
            method: "post",
            action: `/pedals/${id}?name="_action"&value="updatePedal"`,
          }
        );
      }}
    >
      blaaaaaa
    </div>
  );
}
