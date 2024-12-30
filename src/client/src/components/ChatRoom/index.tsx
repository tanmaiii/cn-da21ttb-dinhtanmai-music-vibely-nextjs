import ChatInput from "@/components/Chat/Input";
import { IMAGES, navRoomPage, paths } from "@/lib/constants";
import { artists, songs } from "@/lib/data";
import { RootState } from "@/lib/store";
import chatSerive from "@/services/chat.service";
import {
  listenForMessages,
  sendMessage
} from "@/services/socket.service";
import { IMessageChat } from "@/types/room.type";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Message from "../Chat/Message";
import { ButtonIcon } from "../ui/Button";
import Input from "../ui/Input";
import styles from "./style.module.scss";

interface IChatRoom {
  onClose: () => void;
  roomId: string;
}

const ChatRoom = (props: IChatRoom) => {
  const { onClose, roomId } = props;
  const [nav, setNav] = useState("Chat");
  const listMessagesRef = useRef<HTMLDivElement | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const currentUser = useSelector((state: RootState) => state.user);

  const [message, setMessage] = useState<IMessageChat[] | []>([]);

  const handleSubmit = (message: string) => {
    sendMessage(roomId, currentUser?.id || "", message);
  };

  // useEffect để cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (listMessagesRef.current) {
      listMessagesRef.current.scrollTop = listMessagesRef.current.scrollHeight;
    }
  }, [message]);

  // Lắng nghe tin nhắn mới
  useEffect(() => {
    if (currentUser?.id) {
      const unsubscribe = () =>
        listenForMessages(roomId, currentUser.id, (message: IMessageChat) => {
          setMessage((prevMessages) => [message, ...prevMessages]);
        });

      // Cleanup function để hủy listener cũ
      return () => {
        unsubscribe(); // Hủy lắng nghe
      };
    }
  }, [roomId, currentUser]);

  const {} = useQuery({
    queryKey: ["Room-chat", roomId],
    queryFn: async () => {
      const res = await chatSerive.getAll(roomId, { page: 1, limit: 50 });
      if (res.data.data) {
        setMessage(res.data.data);
        console.log("res", res);
        return res.data.data;
      }
    },
  });

  return (
    <div className={`${styles.RoomChat}`}>
      <div className={`${styles.RoomChat_header}`}>
        <ButtonIcon
          dataTooltip="Close chat"
          onClick={onClose}
          icon={<i className="fa-sharp fa-solid fa-right-to-line"></i>}
        />

        <div className={`${styles.RoomChat_header_nav}`}>
          {navRoomPage.map((item, index) => (
            <div
              key={index}
              className={`${styles.RoomChat_header_nav_item} ${
                nav === item.name && styles.active
              }`}
              onClick={() => setNav(item.name)}
            >
              <h4>{item.name}</h4>
            </div>
          ))}
        </div>

        <ButtonIcon
          hide={true}
          icon={<i className="fa-sharp fa-solid fa-right-to-line"></i>}
        />
      </div>

      <div className={`${styles.RoomChat_body} `}>
        {nav === navRoomPage[0].name && (
          <div
            ref={listMessagesRef}
            className={`${styles.RoomChat_body_chat} `}
          >
            {[...message].reverse().map((message) => (
              <Message key={message.id} data={message} />
            ))}
            <div ref={endOfMessagesRef}></div>
            <div className={`${styles.RoomChat_body_chat_input} `}>
              <ChatInput onSubmit={(value) => handleSubmit(value)} />
            </div>
          </div>
        )}
        {nav === navRoomPage[1].name && (
          <div className={`${styles.RoomChat_body_request} `}>
            <ChatRoomRequest />
          </div>
        )}
        {nav === navRoomPage[2].name && (
          <div className={`${styles.RoomChat_body_member} `}>
            <ChatRoomMember />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;

const ChatRoomRequest = () => {
  const [keyword, setKeyword] = React.useState("");

  const handleSearch = (value: string) => {
    setKeyword(value);
  };

  return (
    <div className={`${styles.ChatRoomRequest}`}>
      <div className={`${styles.swapper}`}>
        <div className={`${styles.header}`}>
          <div className={`${styles.input}`}>
            <button>
              <i className="fa-regular fa-magnifying-glass"></i>
            </button>
            <Input
              value={keyword}
              type="text"
              placeholder="Search for singers, songs..."
              onSubmit={handleSearch}
            />
          </div>
        </div>
        <div className={`${styles.list}`}>
          <ul>
            {songs.map((song, index) => (
              <li key={index}>
                <div className={`${styles.item}`}>
                  <div className={`${styles.item_quantity}`}>
                    <span>123</span>
                    <p>Request</p>
                  </div>
                  <div className={`${styles.item_img}`}>
                    <Image
                      src={IMAGES.AVATAR}
                      alt="image.png"
                      width={50}
                      height={50}
                      quality={90}
                    />
                  </div>
                  <div className={`${styles.item_info}`}>
                    <h4>{song.title}</h4>
                    <p>{song?.owner[0]?.name || "Author"}</p>
                  </div>
                  <div className={`${styles.item_action}`}>
                    <ButtonIcon
                      dataTooltip="Play"
                      className={`${styles.item_action_add}`}
                      icon={<i className="fa-solid fa-play"></i>}
                    />
                    <ButtonIcon
                      dataTooltip="Add"
                      className={`${styles.item_action_add}`}
                      icon={
                        <i className="fa-solid fa-rectangle-history-circle-plus"></i>
                      }
                    />
                    {/* <ButtonIcon
                      className={`${styles.item_action_cancel}`}
                      dataTooltip="Cancel"
                      icon={<i className="fa-solid fa-times"></i>}
                    /> */}
                    {/* <ButtonIcon
                      className={`${styles.item_action_request}`}
                      dataTooltip="Request"
                      icon={<i className="fa-solid fa-plus"></i>}
                    /> */}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const ChatRoomMember = () => {
  return (
    <div className={`${styles.ChatRoomMember}`}>
      <div className={`${styles.swapper}`}>
        <div className={`${styles.header}`}>
          <div className={`${styles.input}`}>
            <button>
              <i className="fa-regular fa-magnifying-glass"></i>
            </button>
            <Input type="text" placeholder="Search for member..." />
          </div>
        </div>
        <div className={`${styles.list}`}>
          <h4>Member(12)</h4>
          <ul>
            {/* Add members (bỏ qua) */}
            {/* <li className={`${styles.add_user}`}>
              <div className={`${styles.swapper}`}>
                <i className="fa-solid fa-plus"></i>
                <span>Invite members</span>
              </div>
            </li> */}
            {artists.map((artist, index) => (
              <li key={index}>
                <div className={`${styles.item}`}>
                  <div className={`${styles.item_img}`}>
                    <Link href={`${paths.ARTIST}/${artist.id}`}>
                      <Image
                        src={IMAGES.AVATAR}
                        alt="image.png"
                        width={50}
                        height={50}
                        quality={90}
                      />
                      <span></span>
                    </Link>
                  </div>
                  <div className={`${styles.item_info}`}>
                    <h4>
                      <Link href={`${paths.ARTIST}/${artist.id}`}>
                        {artist.name}
                      </Link>
                    </h4>
                    <p>Admin</p>
                  </div>
                  <div className={`${styles.item_action}`}>
                    <ButtonIcon
                      dataTooltip="Remove"
                      className={`${styles.item_action_cancel}`}
                      icon={<i className="fa-solid fa-times"></i>}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
