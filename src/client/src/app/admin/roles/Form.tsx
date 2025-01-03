import { FormItem, MultipleSelect } from "@/components/Form";
import roleService, { RoleRequestDto } from "@/services/role.service";
import { IRole } from "@/types/auth.type";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";

import styles from "./style.module.scss";
import { ButtonLabel } from "@/components/ui";

interface Props {
  initialData?: IRole;
  onClose: () => void;
  onSubmit: (values: RoleRequestDto) => void;
}

const Form = ({ initialData, onClose, onSubmit }: Props) => {
  const [form, setForm] = React.useState<RoleRequestDto>({
    name: "",
    permissions: [],
  });
  const { data: permissions } = useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const res = await roleService.getAllPermissions();
      return res.data;
    },
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        permissions: initialData.permissions.map((permission) => permission.id),
      });
    }
  }, [initialData]);

  const handleChange = (value: Partial<RoleRequestDto>) => {
    setForm((prev) => ({ ...prev, ...value }));
  };

  const clearForm = () => {
    setForm({
      name: "",
      permissions: [],
    });
  };

  const handleSubmit = (value: RoleRequestDto) => {
    onSubmit(value);
    clearForm();
  };

  return (
    <div className={styles.form_role}>
      <h4>{initialData ? "Role" : "Create role"}</h4>
      <div className="pb-4">
        <FormItem
          label="Name"
          name="name"
          value={form?.name || ""}
          onChange={(e) => handleChange({ name: e.target.value })}
          placeholder="Role name"
        />
      </div>
      <MultipleSelect
        label="Permissions"
        name="permissions"
        options={
          permissions?.map((permission) => ({
            label: permission.name,
            value: permission.id,
          })) || []
        }
        values={form?.permissions || []}
        onChange={(values: string[]) =>
          handleChange({
            permissions: values,
          })
        }
        desc="Choose permissions for this role"
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
  );
};

export default Form;
