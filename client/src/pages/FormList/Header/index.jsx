import Avatar from "components/Avatar";
import { googleFormIcon } from "utils";

import styles from "./Header.module.scss";

const Header = ({ search, user, logout }) => {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        {googleFormIcon}
        <span>Google Form</span>
      </div>

      <div className={styles.avatar}>
        <Avatar userName={user?.name} logout={logout} />
      </div>
    </div>
  );
};

export default Header;
