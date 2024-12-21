import { Card, CardArtist } from "@/components/Card";
import { MotionDiv } from "@/components/Motion";
import { SectionOneRow } from "@/components/Section";
import Slideshow from "@/components/Slideshow";
import { TrackShort } from "@/components/Track";
import { paths } from "@/lib/constants";
import { artists, playlists, songs } from "@/lib/data";
import { fadeIn } from "@/lib/utils";
import styles from "./root.module.scss";

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const { req } = context;
//   const token = req.cookies.token; // Giả sử token được lưu trong cookies

//   if (!token) {
//     // Nếu chưa đăng nhập, chuyển hướng đến trang login
//     return {
//       redirect: {
//         destination: '/login',
//         permanent: false, // Không phải chuyển hướng vĩnh viễn
//       },
//     };
//   }

//   // Tiếp tục render trang nếu đã đăng nhập
//   return {
//     props: {}, // Truyền dữ liệu cho trang nếu cần
//   };
// }

const Home = () => {
  return (
    <div className={styles.Home}>
      <Slideshow />

      <SectionOneRow title="Song popular" path={paths.PAYLIST}>
        {songs.map((_, index) => (
          <Card key={index} index={index} data={_} />
        ))}
      </SectionOneRow>

      {/* -- Top -- */}
      <div className={`${styles.Home_top_row} `}>
        <div className={`${styles.Home_top_header}`}>
          <h4>Top Hits</h4>
        </div>
        <div className={`${styles.Home_top_row} row`}>
          <MotionDiv
            variants={fadeIn({ direction: "up", delay: 0.12 })}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: true }}
            className={`${styles.Home_top_row_col} col pc-4 t-6 m-12`}
          >
            {songs.slice(0, 4).map((_, index) => (
              <TrackShort key={index} num={index + 1} song={_} />
            ))}
          </MotionDiv>
          <MotionDiv
            variants={fadeIn({ direction: "up", delay: 0.2 })}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: true }}
            className={`${styles.Home_top_row_col} col pc-4 t-6 m-12`}
          >
            {songs.slice(0, 4).map((_, index) => (
              <TrackShort key={index} num={index + 1} song={_} />
            ))}
          </MotionDiv>
          <MotionDiv
            variants={fadeIn({ direction: "up", delay: 0.3 })}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: true }}
            className={`${styles.Home_top_row_col} col pc-4 t-6 m-12`}
          >
            {songs.slice(0, 4).map((_, index) => (
              <TrackShort key={index} num={index + 1} song={_} />
            ))}
          </MotionDiv>
        </div>
      </div>

      <SectionOneRow title="Song popular" path={paths.PAYLIST}>
        {songs.map((_, index) => (
          <Card key={index} index={index} data={_} />
        ))}
      </SectionOneRow>

      <SectionOneRow title="Playlists popular" path={paths.PAYLIST}>
        {playlists.map((_, index) => (
          <Card key={index} index={index} data={_} />
        ))}
      </SectionOneRow>

      <SectionOneRow title="Artist" path={paths.PAYLIST}>
        {artists.map((_, index) => (
          <CardArtist key={index} index={index} artist={_} />
        ))}
      </SectionOneRow>
    </div>
  );
};

export default Home;
