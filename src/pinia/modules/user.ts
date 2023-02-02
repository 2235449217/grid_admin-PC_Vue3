import { login, getUserInfo, setSelfInfo } from '@/api/user';
import { jsonInBlacklist } from '@/api/jwt';
import router from '@/router/index';
import { ElLoading, ElMessage } from 'element-plus';
import {} from 'element-plus';
import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useRouterStore } from './router';
import { RouteRecordRaw } from 'vue-router';

type UserInfoType = {
  uuid: string;
  nickName: string;
  headerImg: string;
  authorityId?: string;
  authorities: {
    level?: number;
    authorityName?: string;
  }[];
  authority: {
    defaultRouter?: string;
  };
  sideMode: string;
  activeColor: string;
  baseColor: string;
  dept: {
    ID: number;
  };
};

export const useUserStore = defineStore('user', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loadingInstance = ref<any>(null);

  const userInfo = ref<UserInfoType>({
    uuid: '',
    nickName: '',
    headerImg: '',
    authorities: [],
    authority: {},
    sideMode: 'dark',
    activeColor: '#4D70FF',
    baseColor: '#fff',
    dept: {
      ID: 0,
    },
  });
  const token = ref(window.localStorage.getItem('token') || '');
  const setUserInfo = (val: UserInfoType) => {
    userInfo.value = val;
  };

  const setToken = (val: string) => {
    token.value = val;
  };

  const NeedInit = () => {
    token.value = '';
    window.localStorage.removeItem('token');
    localStorage.clear();
    router.push({ name: 'Init', replace: true });
  };

  const ResetUserInfo = (value = {}) => {
    userInfo.value = {
      ...userInfo.value,
      ...value,
    };
  };
  /* 获取用户信息*/
  const GetUserInfo = async () => {
    const res = await getUserInfo();
    if (res.data?.userInfo) {
      setUserInfo(res.data.userInfo);
    }
    return res;
  };
  /* 登录*/
  const LoginIn = async (loginInfo: {
    username: string;
    password: string;
    captcha: string;
    captchaId: string;
    rememberMe: boolean;
  }) => {
    loadingInstance.value = ElLoading.service({
      fullscreen: true,
      text: '登录中，请稍候...',
    });
    try {
      const res = await login(loginInfo);
      if (res.data?.user) {
        setUserInfo(res.data.user);
        setToken(res.data.token);
        const routerStore = useRouterStore();
        await routerStore.SetAsyncRouter();
        const asyncRouters = routerStore.asyncRouters;
        asyncRouters.forEach(asyncRouter => {
          router.addRoute(asyncRouter as RouteRecordRaw);
        });
        router.push({ name: userInfo.value.authority.defaultRouter });
        return true;
      }
    } catch (e) {
      loadingInstance.value.close();
    }
    loadingInstance.value.close();
  };
  /* 登出*/
  const LoginOut = async () => {
    const res = await jsonInBlacklist();
    if (res.data) {
      token.value = '';
      sessionStorage.clear();
      localStorage.clear();
      router.push({ name: 'Login', replace: true });
      window.location.reload();
    }
  };
  /* 设置侧边栏模式*/
  const changeSideMode = async (data: string) => {
    const res = await setSelfInfo({ sideMode: data });
    if (res.data) {
      userInfo.value.sideMode = data;
      ElMessage({
        type: 'success',
        message: '设置成功',
      });
    }
  };

  const mode = computed(() => userInfo.value.sideMode);
  const sideMode = computed(() => {
    if (userInfo.value.sideMode === 'dark') {
      return '#191a23';
    } else if (userInfo.value.sideMode === 'light') {
      return '#fff';
    } else {
      return userInfo.value.sideMode;
    }
  });
  const baseColor = computed(() => {
    if (userInfo.value.sideMode === 'dark') {
      return '#fff';
    } else if (userInfo.value.sideMode === 'light') {
      return '#191a23';
    } else {
      return userInfo.value.baseColor;
    }
  });
  const activeColor = computed(() => {
    if (
      userInfo.value.sideMode === 'dark' ||
      userInfo.value.sideMode === 'light'
    ) {
      return '#4D70FF';
    }
    return userInfo.value.activeColor;
  });

  watch(token, () => {
    window.localStorage.setItem('token', token.value);
  });

  return {
    userInfo,
    token,
    NeedInit,
    ResetUserInfo,
    GetUserInfo,
    LoginIn,
    LoginOut,
    changeSideMode,
    mode,
    sideMode,
    setToken,
    baseColor,
    activeColor,
    loadingInstance,
  };
});

export type UserStoreType = ReturnType<typeof useUserStore>;
