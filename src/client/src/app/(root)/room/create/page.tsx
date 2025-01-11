"use client";

import { FormRoom } from "@/components/Form";
import { useCustomToast } from "@/hooks/useToast";
import roomService from "@/services/room.service";
import { RoomRequestDto } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import styles from "./style.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { hasPermission } from "@/lib/utils";
import { paths, PERMISSIONS } from "@/lib/constants";

const Page = () => {
  const { toastSuccess, toastError } = useCustomToast();
  const currentUser = useSelector((state: RootState) => state.user);
  const router = useRouter();

  const mutationAdd = useMutation({
    mutationFn: async (data: RoomRequestDto) => {
      const res = await roomService.create(data);
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

  if (!hasPermission(currentUser?.role.permissions, PERMISSIONS.CREATE_ROOM)) {
    router.push(paths.ROOM);
  }

  return (
    <div className={styles.PageCreateRoom}>
      <FormRoom open={true} onSubmit={(value) => mutationAdd.mutate(value)} />
    </div>
  );
};

export default Page;
