import { IRoom, RoomRequestDto } from "@/types";
import React from "react";

interface Props {
  onSubmit: (values: RoomRequestDto) => void;
  initialData?: IRoom;
  open?: boolean;
  onClose: () => void;
}

const FormRoom = ({ onSubmit, initialData, open, onClose }: Props) => {
  return <div>FormRoom</div>;
};

export default FormRoom;
