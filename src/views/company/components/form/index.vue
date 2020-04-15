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
      <el-button type="primary" @click="editCompany">确 定</el-button>
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
    name: 'CompanyForm',
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
        dialogTableVisible: false,
        dialogFormVisible: true,
        recordFormVisible: false,
        form: {
          id: this.company_obj.id,
          name: this.company_obj.name || '', // 公司名称
          info: this.company_obj.info || '', // 简介
          industry_type: this.company_obj.industry_type || 9, // 行业类别
          contacts: this.company_obj.contacts || '', // 联系方式一
          contacts1: this.company_obj.contacts1 || '', // 联系方式二
          register_capital: this.company_obj.register_capital || '', // 注册资本
          contact_person: this.company_obj.contact_person || '', // 联系人
          url: this.company_obj.url || '', // 公司网址
          level: this.company_obj.level || '', // 评级
          recent_situation: this.company_obj.recent_situation || '', // 近况
          records: this.company_obj.records|| [], // 合作项目
          credentials: this.company_obj.credentials || ''
        },
        formLabelWidth: '100px',
        obj: null // 合作记录的弹出窗口
      }
    },
    methods: {
      editCompany() {
        api.editCompany({data: this.form}).then(() => {
          this.$emit('reGetdata')
          this.$emit('update:companyFormVisible', false)
        })
      },
      removeItemRecordsById(id) {
        if(this.form.records && this.form.records.length == 0) return
        for (let i = 0, l = this.form.records.length; i < l; i++) {
          let record = this.form.records[i];
          if(record.id === id) {
            this.form.records.splice(i, 1)
            break
          }
        }
      },
      editData(val) {
        for (let i = 0, l = this.form.records.length; i < l; i++) {
          let record = this.form.records[i];
          if(record.id === val.id) {
            record.content = val.content
            break
          }
        }
      },
      editRow(index, row) {
        this.obj = {
          record_id: row.id,
          title: '编辑合作项目',
          status: false, // 代表编辑
          type: 2,
          initContent: row.content || ''
        }
        this.recordFormVisible = true
      },
      deleteRow(index, row) {
        const {id} = row
        api.delRecord(id).then(() => {
          this.removeItemRecordsById(id)
        })
      },
      updateRecord(val) {
        this.form.records.push(val)
      },
      showRecordForm() {
        this.obj = {
          company_id: this.form.id,
          title: '新增合作项目',
          status: false, // false 表示编辑
          type: 1,
          initContent: ''
        }
        this.recordFormVisible = true
      },
      cancel() {
        this.$emit('update:companyFormVisible', false)
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
