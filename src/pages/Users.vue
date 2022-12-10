<template>
  <div class="q-pa-md">
    <q-table
      title="Users"
      :rows="filteredUsers"
      :columns="columns"
      :loading="tableLoading"
      row-key="id"
      v-model:pagination="pagination"
      v-model:rows-per-page-options="rowsPerPageOptions"
      @row-click="rowClick"
    >
      <template v-slot:top>
        <div style="width: 100%" class="row">
          <q-input dense debounce="500" color="primary" v-model="searchPhrase">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </template>

      <template v-slot:pagination>
        <q-pagination v-model="activePage" :max="totalPages" />
      </template>

      <template v-slot:body-cell-is_favorite="{ row }">
        <td>
          <q-checkbox
            :modelValue="favoriteUsersIds.includes(row.id)"
            color="red"
            checked-icon="mdi-cards-heart"
            unchecked-icon="mdi-cards-heart-outline"
            indeterminate-icon="help"
            @update:model-value="toggleIsFavorite(row)"
          />
        </td>
      </template>

      <template v-slot:body-cell-avatar="{ value }">
        <td>
          <q-avatar size="2rem">
            <img :src="value" />
          </q-avatar>
        </td>
      </template>
    </q-table>
  </div>
</template>

<script lang="ts">
import { User } from 'src/types/user';
import { defineComponent } from 'vue';
import axios from 'axios';
import { TABLE_COLUMNS } from 'src/utils/constant';
import { QTableProps } from 'quasar';
import {
  getFavoriteUsersLStorage,
  setIsFavoriteToLStorage,
} from 'src/utils/common';

type Pagination = {
  rowsPerPage: number;
};

type Data = {
  users: User[];
  columns: QTableProps['columns'];
  tableLoading: boolean;
  activePage: number;
  totalPages: number;
  pagination: Pagination;
  searchPhrase: string;
  favoriteUsersIds: number[];
  rowsPerPageOptions: number[];
};

export default defineComponent({
  name: 'UsersPage',

  data(): Data {
    return {
      users: [],
      columns: TABLE_COLUMNS,
      tableLoading: false,
      activePage: 1,
      totalPages: 1,
      pagination: {
        rowsPerPage: 10,
      },
      searchPhrase: '',
      favoriteUsersIds: [],
      rowsPerPageOptions: [5, 10, 20, 50],
    };
  },

  created() {
    this.fetchUsers();
    this.fetchFavoriteUsersIds();
  },

  watch: {
    activePage() {
      this.fetchUsers();
    },

    'pagination.rowsPerPage'() {
      this.fetchUsers();
    },
  },

  computed: {
    filteredUsers(): User[] {
      if (!this.searchPhrase) return this.users;
      return this.users.filter(({ id, first_name, last_name }) =>
        Object.values({ id, first_name, last_name })
          .join()
          .includes(this.searchPhrase)
      );
    },
  },

  methods: {
    rowClick(event: Event, user: User) {
      this.$router.push({ name: 'user', params: { id: user.id } });
    },

    async fetchUsers() {
      this.tableLoading = true;
      try {
        const response = await axios({
          url: 'https://reqres.in/api/users',
          method: 'get',
          params: {
            page: this.activePage,
            per_page: this.pagination.rowsPerPage,
          },
        });

        this.users = response.data.data;
        this.totalPages = response.data.total_pages;
        this.tableLoading = false;
      } catch (error) {
        console.error(error);
      }
    },

    fetchFavoriteUsersIds(): void {
      this.favoriteUsersIds = getFavoriteUsersLStorage();
    },

    toggleIsFavorite(user: User) {
      const list = this.favoriteUsersIds.includes(user.id)
        ? this.favoriteUsersIds.filter((id) => id !== user.id)
        : [...this.favoriteUsersIds, user.id];

      setIsFavoriteToLStorage(list);
      this.favoriteUsersIds = list;
    },
  },
});
</script>
