import ChatInput from "@/components/Chat/Input";
import useDebounce from "@/hooks/useDebounce";
import { IMAGES, navRoomPage, paths } from "@/lib/constants";
import { RootState } from "@/lib/store";
import { apiImage } from "@/lib/utils";
import chatSerive from "@/services/chat.service";
import roomService from "@/services/room.service";
import songService from "@/services/song.service";
import { IArtist, ISong } from "@/types";
import { IMessageChat, IRoom } from "@/types/room.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Message from "../Chat/Message";
import { ButtonIcon } from "../ui/Button";
import Input from "../ui/Input";
import styles from "./style.module.scss";
import { socket } from "@/lib/socket";

interface IChatRoom {
  onClose: () => void;
  room: IRoom;
}

const ChatRoom = (props: IChatRoom) => {
  const { onClose, room } = props;
  const [nav, setNav] = useState("Chat");
  const listMessagesRef = useRef<HTMLDivElement | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const currentUser = useSelector((state: RootState) => state.user);

  const [message, setMessage] = useState<IMessageChat[] | []>([]);

  const handleSubmit = (message: string) => {
    currentUser && socket.emit("newMessage", room.id, currentUser.id, message);
  };

  useEffect(() => {
    if (listMessagesRef.current) {
      listMessagesRef.current.scrollTop = listMessagesRef.current.scrollHeight;
    }
  }, [message]);

  useEffect(() => {
    // Người dùng tham gia phòng chat
    socket.emit("joinRoom", room.id, currentUser?.id);

    // Lắng nghe sự kiện "messageReceived" để nhận tin nhắn mới
    socket.on("messageReceived", (message: IMessageChat) => {
      console.log("messageReceived", message);
      setMessage((prevMessages) => [message, ...prevMessages]);
    });

    return () => {
      socket.off("messageReceived");
    };
  }, [room.id, currentUser]);

  const {} = useQuery({
    queryKey: ["room-chat", room.id],
    queryFn: async () => {
      const res = await chatSerive.getAll(room.id, { page: 1, limit: 50 });
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
          {navRoomPage.map((item, index) => {
            if (
              room?.creator?.id !== currentUser?.id &&
              item.name === "Request"
            )
              return null;
            return (
              <div
                key={index}
                className={`${styles.RoomChat_header_nav_item} ${
                  nav === item.name && styles.active
                }`}
                onClick={() => setNav(item.name)}
              >
                <h4>{item.name}</h4>
              </div>
            );
          })}
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
            <ChatRoomRequest roomId={room.id} />
          </div>
        )}
        {nav === navRoomPage[2].name && (
          <div className={`${styles.RoomChat_body_member} `}>
            <ChatRoomMember roomId={room.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;

const ChatRoomRequest = ({ roomId }: { roomId: string }) => {
  const [keyword, setKeyword] = React.useState("");
  const [songs, setSongs] = React.useState<ISong[]>([]);
  const [page, setPage] = React.useState(1);
  const queryClient = useQueryClient();

  const handleSearch = (value: string) => {
    setKeyword(value);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["songs-recomment", page, keyword],
    queryFn: async () => {
      console.log("keyword", keyword);
      const res = await songService.getAllSong({
        page: page,
        limit: 10,
        keyword: keyword,
      });
      if (res.data.data) {
        setSongs((prev: ISong[]) =>
          page === 1 ? res.data.data : [...prev, ...res.data.data]
        );
      }
      return res.data;
    },
  });

  const { data: songsIsExist } = useQuery({
    queryKey: ["room", roomId, "songs"],
    queryFn: async () => {
      const res = await roomService.getAllSong(roomId);
      return res.data;
    },
  });

  const mutionAdd = useMutation({
    mutationFn: async (songId: string) => {
      const res = await roomService.addSong(roomId, [songId]);
      return res.data;
    },
    onSuccess: () => {
      console.log("Add song success");
      queryClient.invalidateQueries({ queryKey: ["room", roomId, "songs"] });
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
            {songs.map((song, index) => {
              if (
                songsIsExist &&
                songsIsExist?.findIndex(
                  (item: ISong) => item.id === song.id
                ) !== -1
              )
                return null;
              return (
                <li key={index}>
                  <div className={`${styles.item}`}>
                    {/* <div className={`${styles.item_quantity}`}>
                    <span>123</span>
                    <p>Request</p>
                  </div> */}
                    <div className={`${styles.item_img}`}>
                      <Image
                        src={
                          song?.imagePath
                            ? apiImage(song.imagePath)
                            : IMAGES.SONG
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
                        onClick={() => mutionAdd.mutate(song.id)}
                        dataTooltip="Add"
                        className={`${styles.item_action_add}`}
                        icon={
                          <i className="fa-solid fa-rectangle-history-circle-plus"></i>
                        }
                      />
                    </div>
                  </div>
                </li>
              );
            })}
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
      const res = await roomService.getMembers(roomId, {
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
