<template>
  <q-layout view="lHh Lpr lFf">
    <q-toolbar>
      <q-btn
        round
        color="primary"
        icon="mdi-arrow-left"
        @click="$router.push({ name: 'users' })"
      />
      <q-toolbar-title> Retencja.pl </q-toolbar-title>
    </q-toolbar>
    <div class="q-pa-md row items-start q-gutter-md justify-center">
      <q-card class="user-card" flat bordered>
        <div class="row">
          <div class="col-5">
            <div class="q-pa-md q-gutter-sm">
              <q-avatar size="10rem">
                <img :src="user?.avatar" />
              </q-avatar>
            </div>
          </div>
          <div class="col column q-pa-md justify-center items-end">
            <div class="text-h5 q-mt-sm q-mb-xs">
              {{ user?.first_name }} {{ user?.last_name }}
            </div>
            <div class="text-h5 q-mb-xs email">
              {{ user?.email }}
            </div>
            <div class="text-h5 q-mt-sm q-mb-xs">
              <q-checkbox
                v-model="isFavorite"
                color="red"
                checked-icon="mdi-cards-heart"
                unchecked-icon="mdi-cards-heart-outline"
                indeterminate-icon="help"
              />
            </div>
          </div>
        </div>
      </q-card>
    </div>
  </q-layout>
</template>

<script lang="ts">
import { User } from 'src/types/user';
import { defineComponent } from 'vue';
import axios from 'axios';
import { LOCAL_STORAGE_FAVORITE_KEY } from 'src/utils/constant';
import { setIsFavoriteToLStorage } from 'src/utils/common';

type Data = {
  user: User | undefined;
  favoriteUsersIds: number[];
};

export default defineComponent({
  name: 'UserPage',

  data(): Data {
    return {
      user: undefined,
      favoriteUsersIds: [],
    };
  },

  created() {
    this.fetchUser();
    this.fetchFavoriteUsersIds();
  },

  computed: {
    userId(): number | undefined {
      return this.user?.id;
    },

    isFavorite: {
      get(): boolean {
        const userId = this.user?.id;
        return !!userId && this.favoriteUsersIds.includes(userId);
      },

      set(value: boolean) {
        if (value && this.userId) {
          const usersIds = [...this.favoriteUsersIds, this.userId];
          setIsFavoriteToLStorage(usersIds);
          this.favoriteUsersIds = usersIds;
        } else if (!value && this.userId) {
          const filteredFavoriteUsers = this.favoriteUsersIds.filter(
            (id) => id !== this.userId
          );
          setIsFavoriteToLStorage(filteredFavoriteUsers);
          this.favoriteUsersIds = filteredFavoriteUsers;
        }
      },
    },
  },

  methods: {
    async fetchUser() {
      const userId = this.$route.params.id;
      const response = await axios({
        url: `https://reqres.in/api/users/${userId}`,
        method: 'get',
      });

      this.user = response.data.data;
    },

    fetchFavoriteUsersIds(): void {
      this.favoriteUsersIds = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_FAVORITE_KEY) || '[]'
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.user-card {
  max-width: 600px;
  min-width: 450px;
  .email {
    font-size: 1rem;
    opacity: 0.6;
  }
}
</style>
