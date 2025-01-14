import { IMAGES } from "@/lib/constants";
import { apiImage } from "@/lib/utils";
import { IMessageChat } from "@/types/room.type";
import Image from "next/image";
import styles from "./style.module.scss";

interface MessageProps {
  data: IMessageChat;
  className?: string;
}

const Message = (props: MessageProps) => {
  const { data, className } = props;
  return (
    <div className={`${styles.Message} ${className}`}>
      <div className={`${styles.Message_avatar}`}>
        <Image
          src={
            data.user?.imagePath
              ? apiImage(data.user?.imagePath)
              : IMAGES.AVATAR
          }
          alt="avatar"
          width={100}
          height={100}
        />
      </div>
      <div className={`${styles.Message_content}`}>
        <h4 className={`${styles.Message_content_name}`}>{data?.user?.name}</h4>
        <span className={`${styles.Message_content_text}`}>{data.content}</span>
      </div>
      <div className={`${styles.Message_more}`}>
        {/* <ButtonIconRound
          icon={<i className="fa-solid fa-ellipsis-vertical"></i>}
          size="small"
        /> */}
      </div>
    </div>
  );
};

export default Message;
