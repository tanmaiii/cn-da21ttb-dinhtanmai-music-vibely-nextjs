import Footer from "@/components/common/Footer";
import Sidebar from "@/components/common/Sidebar";
import { Waiting } from "@/components/Waiting";
import { sidebarAdminLinks } from "@/lib/constants";
import styles from "./admin.module.scss";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <main className={styles.AdminLayout}>
      <div className={`row no-gutters ${styles.AdminLayout_top}`}>
        <div className={`${styles.AdminLayout_top_sidebar}`}>
          <Sidebar links={sidebarAdminLinks} />
        </div>

        <div className={` ${styles.AdminLayout_top_main}`}>
          <div
            className={`AdminLayout_main ${styles.AdminLayout_top_main_content}`}
          >
            <div className={` ${styles.AdminLayout_top_main_content_body}`}>
              <div
                className={` ${styles.AdminLayout_top_main_content_body_list}`}
              >
                {children}
              </div>
              <Footer />
            </div>
          </div>
          <div className={`${styles.AdminLayout_top_main_waiting}`}>
            <Waiting />
          </div>
        </div>
      </div>
    </main>
  );
}
