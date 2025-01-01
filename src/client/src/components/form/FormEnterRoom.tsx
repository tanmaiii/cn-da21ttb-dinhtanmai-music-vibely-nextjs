import React from "react";
import styles from "./style.module.scss";
import { ButtonLabel } from "../ui";
import FormItem from "../auth/FormItem";

interface Props {
  onClose: () => void;
  onSubmit: (password: string) => void;
}

const FormEnterRoom = ({ onClose, onSubmit }: Props) => {
  const [password, setPassword] = React.useState<string>("");

  const handleSubmit = () => {
    if (!password) return;
    onSubmit(password);
  };

  return (
    <div className={styles.FormEnterRoom}>
      <h3>Enter password to join room</h3>
      <div className={styles.CardRoom_modal_form}>
        <FormItem
          label="Password"
          placeholder="Enter password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          // error={errors.password}
        />
      </div>
      <div className={styles.buttons}>
        <ButtonLabel
          onClick={() => onClose()}
          className={`${styles.buttons_btnCancel}`}
        >
          <label>Cancel</label>
        </ButtonLabel>

        <ButtonLabel
          onClick={() => handleSubmit()}
          className={`${styles.buttons_btnCreate}`}
        >
          <label>Create</label>
        </ButtonLabel>
      </div>
    </div>
  );
};

export default FormEnterRoom;
