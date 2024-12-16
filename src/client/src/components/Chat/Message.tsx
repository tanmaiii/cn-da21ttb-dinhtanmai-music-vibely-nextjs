import avatarDefault from "@/public/images/avatar.png";
import Image from "next/image";
import { ButtonIconRound } from "../ui/Button";
import styles from "./style.module.scss";

interface MessageProps {
  name: string;
  text: string;
  img?: string;
}

const Message = (props: MessageProps) => {
  const { name, text, img } = props;
  return (
    <div className={`${styles.Message}`}>
      <div className={`${styles.Message_avatar}`}>
        {img ? (
          <Image src={img} alt="avatar" width={100} height={100} />
        ) : (
          <Image src={avatarDefault} alt="avatar" width={100} height={100} />
        )}
      </div>
      <div className={`${styles.Message_content}`}>
        <h4 className={`${styles.Message_content_name}`}>{name}</h4>
        <span className={`${styles.Message_content_text}`}>{text}</span>
      </div>
      <div className={`${styles.Message_more}`}>
        <ButtonIconRound
          icon={<i className="fa-solid fa-ellipsis-vertical"></i>}
          size="small"
        />
      </div>
    </div>
  );
};

export default Message;
