<template>
  <div class="shadow">
    <div class="fix">
      <p class="name">{{obj.title}}</p>
      <el-input v-model="record" class="input"></el-input>
      <div class="footer">
        <el-button size="mini" @click="cancel">取消</el-button>
        <el-button size="mini" @click="submit" type="primary">确认</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import * as api from '@/api/company'
  export default {
    name: "RecordForm",
    props: {
      obj: {
        type: Object
      }
    },
    data() {
      return {
        record: this.obj.initContent
      }
    },
    methods: {
      cancel() {
        this.$emit('update:recordFormVisible', false)
        this.$emit('update:obj', null)
      },
      submitHandle() {
        api.addRecord(this.obj.company_id, this.record).then(res => {
          this.$emit('updateData', res.data)
          this.cancel()
        })
      },
      addCompanySubmitHandle() {
        this.$emit('updateData', {content: this.record})
        this.cancel()
      },
      editHandle() {
        api.editRecord(this.obj.record_id, this.record).then(res => {
          this.$emit('editData', res.data)
          this.cancel()
        })
      },
      addCompanyEditHandle() {
        this.$emit('editData', {
          index: this.obj.index,
          content: this.record
        })
        this.cancel()
      },
      submit() {
        if(this.obj.type == 1 && !this.obj.status) {
          this.submitHandle()
        } else if(this.obj.type == 2 && !this.obj.status) {
          this.editHandle()
        } else if(this.obj.status && this.obj.type == 1) {
          this.addCompanySubmitHandle()
        } else if(this.obj.status && this.obj.type == 2) {
          this.addCompanyEditHandle()
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .shadow {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 999;
  }
  .name {
    text-align: center;
    font-weight: bold;
    margin-bottom: 10px;
    padding-bottom: 0;
  }

  .fix {
    position: fixed;
    left: 50%;
    top: 50%;
    width: 400px;
    margin-left: -200px;
    height: 145px;
    margin-top: -150px;
    background: #f8f8f8;
    border: 1px solid #DCDFE6;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
    padding-bottom: 50px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  }

  .input {
    margin: 10px;
    box-sizing: border-box;
    width: calc(100% - 20px);
  }

  .footer {
    width: 100%;
    position: absolute;
    right: 10px;
    bottom: 10px;
    text-align: right;
  }
</style>
