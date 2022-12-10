import { QTableProps } from "quasar";

export const LOCAL_STORAGE_FAVORITE_KEY = "users_favorite";
export const TABLE_COLUMNS: QTableProps["columns"] = [
  {
    name: "id",
    required: true,
    label: "ID",
    align: "left",
    field: "id",
    sortable: true,
    headerStyle: "width: 2rem",
  },
  {
    name: "is_favorite",
    field: "is_favorite",
    label: "",
    align: "left",
    headerStyle: "width: 2rem",
  },
  {
    name: "avatar",
    label: "Avatar",
    align: "left",
    field: "avatar",
    headerStyle: "width: 3rem;",
  },
  {
    name: "first_name",
    label: "First name",
    align: "left",
    field: "first_name",
    sortable: true,
  },
  {
    name: "last_name",
    label: "Last name",
    align: "left",
    field: "last_name",
    sortable: true,
  },
];
