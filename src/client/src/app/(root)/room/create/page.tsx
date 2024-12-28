"use client";

import { FormRoom } from "@/components/Form";
import styles from "./style.module.scss";
import { useMutation } from "@tanstack/react-query";
import { RoomRequestDto } from "@/types";
import roomSerive from "@/services/room.service";
import { useCustomToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";

const Page = () => {
  const { toastSuccess, toastError } = useCustomToast();
  const router = useRouter();

  const mutationAdd = useMutation({
    mutationFn: async (data: RoomRequestDto) => {
      const res = await roomSerive.create(data);
      return res.data;
    },
    onSuccess: (data) => {
      toastSuccess("Create room successfully");
      router.push("/room/" + data.id);
    },
    onError: () => {
      toastError("Create room failed");
    },
  });

  return (
    <div className={styles.PageCreateRoom}>
      <FormRoom onSubmit={(value) => mutationAdd.mutate(value)} />
    </div>
  );
};

export default Page;
