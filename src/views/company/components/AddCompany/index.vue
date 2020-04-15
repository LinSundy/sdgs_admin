<template>
  <el-dialog title="合作公司信息" @close="cancel" :visible="true" :close-on-click-modal="false">
    <el-form :model="form">
      <el-form-item label="公司名称" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="注册资本" :label-width="formLabelWidth">
            <el-input v-model="form.register_capital" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人" :label-width="formLabelWidth">
            <el-input v-model="form.contact_person" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="12">
          <el-form-item label="行业类别" :label-width="formLabelWidth">
            <el-select v-model="form.industry_type" placeholder="请选择行业类别">
              <el-option v-for="(type, index) in INDUSTRY_TYPE"
                         :key="`type${index}`"
                         :label="type.name" :value="type.id"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="评级" :label-width="formLabelWidth">
            <el-select v-model="form.level" placeholder="请选择评级">
              <el-option v-for="(level, index) in 10" :label="level" :value="level" :key="`level${index}`"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系方式一" :label-width="formLabelWidth">
            <el-input v-model="form.contacts" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系方式二" :label-width="formLabelWidth">
            <el-input v-model="form.contacts1" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="公司网址" :label-width="formLabelWidth">
        <el-input v-model="form.url"></el-input>
      </el-form-item>
      <el-form-item label="单位简介" :label-width="formLabelWidth">
        <el-input type="textarea" :autosize="true" v-model="form.info"></el-input>
      </el-form-item>
      <el-form-item label="近况" :label-width="formLabelWidth">
        <el-input type="textarea" :autosize="true" v-model="form.recent_situation"></el-input>
      </el-form-item>
      <el-form-item label="资质" :label-width="formLabelWidth">
        <el-input type="textarea" :autosize="true" v-model="form.credentials"></el-input>
      </el-form-item>
      <el-form-item label="合作项目" :label-width="formLabelWidth">
        <el-button class="add_item" size="small" type="primary" @click="showRecordForm">添加合作项目</el-button>
        <el-table
          class="table"
          :show-header="false"
          :data="form.records"
          v-if="form.records && form.records.length > 0"
          style="width: 100%">
          <el-table-column
            prop="content"
            label="名称"
          >
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="120">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="editRow(scope.$index, scope.row)"
                type="text"
                size="small">
                编辑
              </el-button>
              <el-button
                @click.native.prevent="deleteRow(scope.$index, scope.row)"
                type="text"
                size="small">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="addCompany">确 定</el-button>
    </div>
    <RecordForm :recordFormVisible="recordFormVisible"
                @editData="editData"
                @updateData="updateRecord"
                :obj.sync="obj"
                v-if="recordFormVisible && obj"></RecordForm>
  </el-dialog>
</template>

<script>
  import RecordForm from '../RecordForm'
  import * as api from '@/api/company'

  const INDUSTRY_TYPE = [
    {
      id: 1,
      name: '工程设计类'
    },
    {
      id: 2,
      name: '工程承包类'
    },
    {
      id: 3,
      name: '设备物资类'
    },
    {
      id: 4,
      name: '法律服务类'
    },
    {
      id: 5,
      name: '财务审计类'
    },
    {
      id: 6,
      name: '资产评估类'
    },
    {
      id: 7,
      name: '劳务派遣类'
    },
    {
      id: 8,
      name: '其他类'
    }
  ]
  export default {
    name: 'AddCompany',
    components: {
      RecordForm
    },
    props: {
      company_obj: {
        type: Object
      }
    },
    data() {
      return {
        INDUSTRY_TYPE,
        recordFormVisible: false,
        form: {
          name: '', // 公司名称
          info: '', // 简介
          industry_type: 1, // 行业类别
          contacts: '', // 联系方式一
          contacts1: '', // 联系方式二
          register_capital: '', // 注册资本
          contact_person: '', // 联系人
          url: '', // 公司网址
          level: 1, // 评级
          recent_situation: '', // 近况
          records: [], // 合作项目
          credentials: '' // 资质
        },
        formLabelWidth: '100px',
        obj: null // 合作记录的弹出窗口
      }
    },
    methods: {
      addCompany() {
        api.addOneCompany({data: this.form}).then(res => {
          this.$emit('reGetdata')
          this.cancel()
        })
      },
      editData(val) {
        this.form.records[val.index].content = val.content
      },
      editRow(index, row) {
        this.obj = {
          index: index,
          record_id: row.id,
          title: '编辑合作项目',
          type: 2,
          status: true,
          initContent: row.content || ''
        }
        this.recordFormVisible = true
      },
      deleteRow(index) {
        if(this.form.records && this.form.records.length == 0) return
        this.form.records.splice(index, 1)
      },
      updateRecord(val) {
        this.form.records.push(val)
      },
      showRecordForm() {
        this.obj = {
          company_id: this.form.id,
          title: '新增合作项目',
          status: true, // false 表示编辑 true表示新增
          type: 1,
          initContent: ''
        }
        this.recordFormVisible = true
      },
      cancel() {
        this.$emit('update:addCompanyFormVisible', false)
      }
    }
  }
</script>

<style scoped lang="scss">
  .add_item {
    margin-bottom: 20px;
  }

  .table {
    border: 1px solid #DCDFE6;
    border-bottom: none;
  }
</style>
