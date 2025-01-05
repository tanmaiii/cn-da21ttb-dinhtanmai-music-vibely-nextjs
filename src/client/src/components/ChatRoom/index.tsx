import ChatInput from "@/components/Chat/Input";
import useDebounce from "@/hooks/useDebounce";
import { IMAGES, navRoomPage, paths } from "@/lib/constants";
import { RootState } from "@/lib/store";
import { apiImage } from "@/lib/utils";
import chatSerive from "@/services/chat.service";
import roomSerive from "@/services/room.service";
import { listenForMessages, sendMessage } from "@/services/socket.service";
import songService from "@/services/song.service";
import { IArtist, ISong } from "@/types";
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
    queryKey: ["room-chat", roomId],
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
          className={styles.RoomChat_header_hide}
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
            <ChatRoomRequest roomId={roomId} />
          </div>
        )}
        {nav === navRoomPage[2].name && (
          <div className={`${styles.RoomChat_body_member} `}>
            <ChatRoomMember roomId={roomId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;

const ChatRoomRequest = ({}: { roomId: string }) => {
  const [keyword, setKeyword] = React.useState("");
  const [songs, setSongs] = React.useState<ISong[]>([]);
  const [page, setPage] = React.useState(1);
  const debouncedSearchTerm = useDebounce({ value: keyword, delay: 500 });

  const handleSearch = (value: string) => {
    setKeyword(value);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["songs-recomment", page, debouncedSearchTerm],
    queryFn: async () => {
      console.log("debouncedSearchTerm", debouncedSearchTerm);
      const res = await songService.getAllSong({
        page: page,
        limit: 10,
        keyword: debouncedSearchTerm,
      });
      if (res.data.data) {
        setSongs((prev: ISong[]) =>
          page === 1 ? res.data.data : [...prev, ...res.data.data]
        );
      }
      return res.data;
    },
  });

  const totalPages = data?.totalPages || 1;

  return (
    <div className={`${styles.ChatRoomRequest}`}>
      <div className={`${styles.swapper}`}>
        <div className={`${styles.header}`}>
          <div className={`${styles.input}`}>
            <div className={`${styles.icon}`}>
              <i className="fa-regular fa-magnifying-glass"></i>
            </div>
            <Input
              value={keyword}
              type="text"
              placeholder="Search for singers, songs..."
              onSubmit={handleSearch}
            />
            {keyword && (
              <button
                className={`${styles.clear}`}
                onClick={() => setKeyword("")}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
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
                      src={
                        song?.imagePath ? apiImage(song.imagePath) : IMAGES.SONG
                      }
                      alt="image.png"
                      width={50}
                      height={50}
                      quality={90}
                    />
                  </div>
                  <div className={`${styles.item_info}`}>
                    <h4>{song.title}</h4>
                    <p>{song?.creator?.name || "Author"}</p>
                  </div>
                  <div className={`${styles.item_action}`}>
                    <ButtonIcon
                      dataTooltip="Add"
                      className={`${styles.item_action_add}`}
                      icon={
                        <i className="fa-solid fa-rectangle-history-circle-plus"></i>
                      }
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {page < totalPages && !isLoading && (
            <button
              onClick={() => setPage(page + 1)}
              className={styles.load_more}
            >
              <span>Load more</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ChatRoomMember = ({ roomId }: { roomId: string }) => {
  const [keyword, setKeyword] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [allMembers, setAllMembers] = React.useState<IArtist[]>([]);
  const debouncedSearchTerm = useDebounce({ value: keyword, delay: 500 });

  const { data, isLoading } = useQuery({
    queryKey: ["room-member", roomId, page, debouncedSearchTerm],
    queryFn: async () => {
      console.log("debouncedSearchTerm", debouncedSearchTerm);
      const res = await roomSerive.getMembers(roomId, {
        page,
        limit: 10,
        keyword,
      });
      if (res.data.data) {
        setAllMembers((prev) =>
          page === 1 ? res.data.data : [...prev, ...res.data.data]
        );
      }

      return res.data;
    },
  });

  const total = data?.totalItems || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <div className={`${styles.ChatRoomMember}`}>
      <div className={`${styles.swapper}`}>
        <div className={`${styles.header}`}>
          <div className={`${styles.input}`}>
            <button>
              <i className="fa-regular fa-magnifying-glass"></i>
            </button>
            <Input
              type="text"
              placeholder="Search for member..."
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>
        <div className={`${styles.list}`}>
          <h4>{`Member(${total ?? 0})`}</h4>
          <ul>
            {/* Add members (bỏ qua) */}
            {/* <li className={`${styles.add_user}`}>
              <div className={`${styles.swapper}`}>
                <i className="fa-solid fa-plus"></i>
                <span>Invite members</span>
              </div>
            </li> */}
            {allMembers &&
              allMembers.map((artist, index) => (
                <li key={index}>
                  <div className={`${styles.item}`}>
                    <div className={`${styles.item_img}`}>
                      <Link href={`${paths.ARTIST}/${artist.slug}`}>
                        <Image
                          src={
                            artist?.imagePath
                              ? apiImage(artist.imagePath)
                              : IMAGES.AVATAR
                          }
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
                        <Link href={`${paths.ARTIST}/${artist.slug}`}>
                          {artist.name}
                        </Link>
                      </h4>
                      <p>{artist?.role?.name}</p>
                    </div>
                    {/* <div className={`${styles.item_action}`}>
                      <ButtonIcon
                        dataTooltip="Remove"
                        className={`${styles.item_action_cancel}`}
                        icon={<i className="fa-solid fa-times"></i>}
                      />
                    </div> */}
                  </div>
                </li>
              ))}
          </ul>

          {/* Load More Button */}
          {page < totalPages && !isLoading && (
            <button
              onClick={() => setPage(page + 1)}
              className={styles.load_more}
            >
              <span>Load more</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
