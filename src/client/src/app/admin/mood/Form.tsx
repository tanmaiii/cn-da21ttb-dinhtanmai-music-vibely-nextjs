import { FormItem } from "@/components/Form";
import { useEffect, useState } from "react";

import { ButtonLabel } from "@/components/ui";
import { GenreRequestDto, IGenre } from "@/types/genre.type";
import { MoodRequestDto } from "@/types/mood.type";
import styles from "./style.module.scss";

interface Props {
  initialData?: IGenre;
  onClose: () => void;
  onSubmit: (values: MoodRequestDto) => void;
}

const FormMood = ({ initialData, onClose, onSubmit }: Props) => {
  const [form, setForm] = useState<MoodRequestDto>({
    title: "",
    description: "",
  });
  const [errors, setErrors] = useState<Partial<MoodRequestDto>>({});

  useEffect(() => {
    clearForm();
    if (initialData) {
      setForm({
        title: initialData?.title,
        description: initialData?.description,
      });
    }
  }, [initialData]);

  const validateForm = (values: MoodRequestDto) => {
    const errors: Partial<MoodRequestDto> = {};
    let hasError = false;

    if (!values?.title) {
      errors.title = "title is required";
      hasError = true;
    }

    return { errors, hasError };
  };

  const handleChange = (value: Partial<GenreRequestDto>) => {
    setForm((prev) => ({ ...prev, ...value }));
  };

  const clearForm = () => {
    setForm({
      title: "",
      description: "",
    });
  };

  const handleSubmit = async (formValues: GenreRequestDto) => {
    const { errors, hasError } = validateForm(form);
    setErrors(errors);
    if (hasError) return;

    onSubmit(formValues);
    clearForm();
  };

  return (
    <div className={styles.FormMood}>
      <h4>{"Mood"}</h4>
      <div className={styles.FormMood_content}>
        <div className={styles.FormMood_content_info}>
          <FormItem
            label="Title"
            name="title"
            value={form?.title || ""}
            onChange={(e) => handleChange({ title: e.target.value })}
            error={errors.title}
          />
          <FormItem
            label="Description"
            name="description"
            type="textarea"
            value={form?.description || ""}
            onChange={(e) => handleChange({ description: e.target.value })}
            error={errors.description}
          />

          <div className={styles.buttons}>
            <ButtonLabel
              onClick={() => {
                clearForm();
                onClose();
              }}
              line={true}
              className={styles.buttons_button}
            >
              <label htmlFor="">Cancel</label>
            </ButtonLabel>
            <ButtonLabel
              onClick={() => handleSubmit(form)}
              type="submit"
              className={`${styles.buttons_btnCreate}`}
            >
              <label htmlFor="">Save</label>
            </ButtonLabel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormMood;
