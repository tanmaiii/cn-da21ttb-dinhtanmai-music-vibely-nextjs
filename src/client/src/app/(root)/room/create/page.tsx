"use client";

import { FormRoom } from "@/components/Form";
import { useCustomToast } from "@/hooks/useToast";
import roomSerive from "@/services/room.service";
import { RoomRequestDto } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import styles from "./style.module.scss";

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
    onError: (error) => {
      toastError((error as Error)?.message || "Create room failed");
    },
  });

  return (
    <div className={styles.PageCreateRoom}>
      <FormRoom onSubmit={(value) => mutationAdd.mutate(value)} />
    </div>
  );
};

export default Page;
