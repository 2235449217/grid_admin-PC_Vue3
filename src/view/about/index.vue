<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div>GoSword</div>
          </template>
          <div>
            <el-row>
              <el-col :span="8" :offset="8">
                <img
                  class="org-img dom-center"
                  src="@/assets/marchsoftgolang.png"
                  alt="flipped-aurora"
                  style="height: 200px" />
              </el-col>
            </el-row>
            <el-row style="margin-left: 40px" :gutter="20">
              <el-col v-for="(item, index) in members" :key="index" :span="8">
                <a :href="item.html_url">
                  <img class="avatar-img" :src="item.Avatar" />
                  <a class="author-name" style="">{{ item.Name }}</a>
                </a>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card style="margin-top: 10px">
          <template #header>
            <el-divider>go-sword</el-divider>
          </template>
          <div>
            <el-row>
              <el-col :span="8" :offset="8">
                <a href="https://github.com/flipped-aurora">
                  <a
                    href="https://marchsoft.coding.net/p/golangkuangjia/d/GoSword/git">
                    <img
                      class="org-img dom-center"
                      src="@/assets/golang_jump.gif"
                      alt="GoSword" />
                    <img
                      class="org-img dom-center"
                      src="@/assets/weight_lifting.gif"
                      alt="GoSword"
                      style="width: 280px" />
                    <img
                      class="org-img dom-center"
                      src="@/assets/gophercises_punching.gif"
                      alt="GoSword"
                      style="width: 300px" />
                  </a>
                </a>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div>提交记录</div>
          </template>
          <div>
            <el-timeline>
              <el-timeline-item
                v-for="(item, index) in dataTimeline"
                :key="index"
                :timestamp="item.from"
                placement="top">
                <el-card>
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.message }}</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
          <!-- <el-button
            class="load-more"
            type="text"
            @click="loadMore"
          >Load more</el-button> -->
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'About',
};
</script>

<script setup>
import { ref } from 'vue';
import { Commits, Members } from '@/api/github';
import { formatTimeToStr } from '@/utils/date';

const page = ref(1);

const dataTimeline = ref([]);
const loadCommits = () => {
  Commits({
    Action: 'DescribeGitCommits',
    PageNumber: page.value,
    DepotId: 9511486,
    Ref: 'develop',
    PageSize: 10,
  }).then(({ data }) => {
    data.Response.Commits.forEach(element => {
      if (element.ShortMessage) {
        dataTimeline.value.push({
          from: formatTimeToStr(element.CommitDate, 'yyyy-MM-dd'),
          title: element.Commiter.Name,
          showDayAndMonth: true,
          message: element.ShortMessage,
        });
      }
    });
  });
};

const members = ref([]);
const loadMembers = () => {
  Members({
    Action: 'DescribeProjectMembers',
    PageNumber: 1,
    PageSize: 10,
    ProjectId: 10235846,
  }).then(({ data }) => {
    members.value = data.Response.Data.ProjectMembers;
    members.value.sort();
  });
};

loadCommits();
loadMembers();
</script>

<style scoped>
.load-more {
  margin-left: 120px;
}

.avatar-img {
  float: left;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  margin-top: 15px;
}

.org-img {
  height: 200px;
  width: 200px;
}

.author-name {
  float: left;
  line-height: 65px !important;
  margin-left: 10px;
  color: darkblue;
  line-height: 100px;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande',
    'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
}

.dom-center {
  margin-left: 50%;
  transform: translateX(-50%);
}
</style>
