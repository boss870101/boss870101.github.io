<template>
  <Card dis-hover :bordered="false">
    <div slot="title">
      <div style="margin-bottom: 15px">
        <Button type="primary" @click="createShop">新建店铺</Button>
      </div>
      <div>
        <Input 
          v-model="name_icontains" 
          placeholder="请输入店铺名..." 
          style="width: 200px">
        </Input>
        <Cascader 
          :data="divisionsData" 
          v-model="disivisonValue"
          style="width: 338px; display: inline-block; margin-left: 10px;">
        </Cascader>
        <Select clearable v-model="status" style="width:120px; margin-left: 10px">
          <Option :value="0" label="关闭">
          </Option>
          <Option :value="1" label="筹备">
          </Option>
          <Option :value="2" label="正常">
          </Option>
        </Select>
      </div>
      <div style="margin-top: 16px;">
        <Input 
          v-model="contact" 
          placeholder="请输入联系人..." 
          style="width: 200px">
        </Input>
        <Input 
          v-model="phone" 
          placeholder="请输入电话号码..." 
          style="width: 200px; margin-left: 10px;">
        </Input>
        <Date-picker 
          :value="date" 
          format="yyyy-MM-dd" 
          type="daterange"
          @on-change="dateChange"
          placement="bottom-end" 
          placeholder="选择日期" 
          style="width: 200px; display: inline-block; margin-left: 10px;">
        </Date-picker>
        <Button type="primary" @click="search" style="margin-left: 10px;">查询</Button>
      </div>
    </div>
    <Row>
      <Col span="24">
        <Table 
          :row-class-name="rowClassName" 
          border 
          :columns="columns" 
          :data="shops">
        </Table>
        <Page 
          style="float: right; margin-top: 30px" 
          :total="total" 
          :page-size="page_size" 
          :current="page"
          @on-page-size-change="pageSizeChange"
          @on-change="pageChange"
          show-total 
          show-elevator 
          show-sizer>
        </Page>
      </Col>
    </Row>
    <Modal
      v-model="shopModal"
      title="编辑店铺">
      <div style="width: 280px; margin: 0 auto;">
        <Form ref="formValue" :model="formValue" :rules="ruleValue" :label-width="80">
          <Form-item prop="name" label="店铺">
            <Input 
              v-model="formValue.name" 
              placeholder="请输入店铺名称..." 
              style="width: 200px;">
            </Input>
          </Form-item>
          <Form-item prop="ename" label="ename">
            <Input 
              v-model="formValue.ename" 
              placeholder="请输入ename..." 
              style="width: 200px;">
            </Input>
          </Form-item>
          <Form-item prop="code" label="编码">
            <Input 
              v-model="formValue.code" 
              placeholder="请输入编码..." 
              style="width: 200px;">
            </Input>
          </Form-item>
          <Form-item prop="contact" label="联系人">
            <Input 
              v-model="formValue.contact" 
              placeholder="请输入联系人..." 
              style="width: 200px;">
            </Input>
          </Form-item>
          <Form-item prop="phone" label="联系电话">
            <Input 
              v-model="formValue.phone" 
              placeholder="请输入联系电话..." 
              style="width: 200px;">
            </Input>
          </Form-item>
          </Form-item>
          <Form-item prop="status" label="状态">
            <Select v-model="formValue.status" style="width:200px">
              <Option :value="0">关闭</Option>
              <Option :value="1">筹备</Option>
              <Option :value="2">正常</Option>
            </Select>
          </Form-item>
          <Form-item prop="location" label="地址">
            <Cascader :data="divisionsData" v-model="formValue.location" style="width: 200px"></Cascader>
          </Form-item>
           <Form-item prop="address" label="详细地址">
            <Input 
              v-model="formValue.address" 
              placeholder="请输入详细地址..." 
              style="width: 200px;">
            </Input>
          </Form-item>
          <Form-item prop="joined_time" label="加入时间">
            <Date-picker 
              type="date"
              :value="formValue.joined_time" 
              placeholder="选择加入日期"
              @on-change="joinedChange"
              @on-clear="()=> formValue.joined_time = ''"
              :options="optionsDate"
              format="yyyy-MM-dd" 
              style="width: 160px; display: inline-block">
            </Date-picker>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="handleReset">重置</Button>
        <Button type="primary" size="large"  @click="editShopOk">确定</Button>
      </div>
    </Modal>
  </Card>
</template>
<script>
  import moment from "moment";
  import util from "@/libs/util";
  import divisions from "@/data/divisions.json";

  export default {
    data () {
      // phone rules
      const validatePhone = ( rule, value, callback ) => {
        const pattern = /^(13[0-9]|14[57]|15[012356789]|17[0135678]|18[0-9])[0-9]{8}$/;
        if( pattern.test( value )){
          callback();
        }else{
          callback( new Error( '请添写正确的手机号码' ) );
        }
      }
      // date rules
      const validateDate = ( rule, value, callback ) => {
        if( value ){
          callback();
        }else{
          callback( new Error( '请选择日期' ) );
        }
      }
      // form rules
      const ruleValue = {
        name: [
          { required: true, type: 'string', trigger: 'blur', message: '请添写店铺名称' }
        ],
        ename: [
          { required: true, type: 'string', trigger: 'blur', message: '请添写ename' }
        ],
        code: [
          { required: true, type: 'string', trigger: 'blur', message: '请添写编码' }
        ],
        contact: [
          { required: true, type: 'string', trigger: 'blur', message: '请添写联系人' }
        ],
        phone: [
          { required: true, type: 'string', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        location: [
          { required: true, type: 'array', min: 3, trigger: 'change', message: '请选择地址' }
        ],
        status: [
          { required: true, type: 'string', trigger: 'blur' }
        ],
        address: [
          { required: true, type: 'string', trigger: 'blur' }
        ],
        joined_time: [
          { required: true, type: 'number', message: '请选择日期' },
          { validator: validateDate, trigger: 'blur' }
        ],
      }

      return {
        formValue: {
          date: '',
          location: [],
          ename: '',
          name: '',
          code: '',
          phone: '',
          province: '',
          city: '',
          status: '',
          district: '',
          address: '',
          contact: '',
          joined_time: []
        },
        formValueCopy: {},
        shopModal: false,
        shops: [],
        shopIds: [],
        name_icontains: '',
        status: '',
        phone: '',
        date: [],
        time__gte: '',
        time__lte: '',
        contact: '',
        lines: [],
        ranks: [],
        warehouses: [],
        columns: [
          {
            title: '编码',
            align: 'center',
            key: 'code'
          },
          {
            title: '店铺',
            align: 'center',
            key: 'name'
          },
          {
            title: '地址',
            align: 'center',
            render: ( h, params ) => h( 'span',
              params.row.city + params.row.district + params.row.address
            )
          },
          {
            title: '联系人',
            align: 'center',
            render: ( h, params ) => h( 'span', params.row.contact )
          },
          {
            title: '联系电话',
            align: 'center',
            render: ( h, params ) => h( 'span', params.row.phone )
          },
          {
            title: '店铺状态',
            align: 'center',
            render: ( h, params ) => h( 'span', 
              params.row.status == 0 ? '关闭' : params.row.status == 1 ? '筹备' : '正常'
            )
          },
          {
            title: '加入时间',
            align: 'center',
            render: ( h, params ) => h( 'span', 
              moment( params.row.joined_time ).format( 'YYYY-MM-DD' )
            )
          },
          {
            title: '操作',
            align: 'center',
            render: ( h, params ) => h( 'div', [
              h( 'Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => this.$router.push({name: 'AccountsShop', params: { id: params.row.id } })
                }
              }, '查看' ),
              h( 'Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                on: {
                  click: () => this.editShop( params.index )
                }
              }, '编辑' )
            ] )
          }
        ],
        ruleValue,
        divisionsData: divisions,
        disivisonValue: [],
        optionsDate: {
          disabledDate(date){
            return date && date.valueOf() < Date.now() - 86400000;
          }
        },
        page_size: 30,
        page: 1,
        total: 0,
        idx: -1,
        index: -1
      }
    },
    mounted(){
      this.fetchShops();
      this.fetchLine();
      this.fetchRanks();
    },

    methods: {
      fetchShops(){
        util.accountAxios.get( '/enterprises/shop/list/', {
          params: {
            page_size: this.page_size,
            page: this.page,
            name__icontains: this.name_icontains,
            province: this.disivisonValue[0],
            city: this.disivisonValue[1],
            district: this.disivisonValue[2],
            contact: this.contact,
            phone: this.phone,
            joined_time__gte: this.time__gte,
            joined_time__lte: this.time__lte,
            status: this.status
          }
        } ).then( response => {
          const { errcode, results, page_size, page, total } = response.data;
          if( !errcode ){
            this.shops = results;
            this.page_size = page_size;
            this.page = page;
            this.total = total;
          }
        } )
      },

      detailPage( id ){
        this.$router.push({name: 'AccountsShop', params: { id } });
      },

      fetchLine() {
        util.bookAxios.get( '/setups/line/list/', {
          params: {
            page_size: 1000,
            page: 1,
          }
        } ).then( response => {
          const { errcode, results } = response.data;
          if( !errcode ){
            this.lines = results;
          }
        } )
      },

      fetchRanks(){
        util.bookAxios.get('/setups/rank/list/').then((response) => {
          const { results, errcode } = response.data;
          if( !errcode ){
            this.ranks = results;
          }    
        })
      },

      // table row classname
      rowClassName (row, index) {
        if( row.status == 0 ){
          return 'shop-status-red'
        }else if( row.status == 1 ){
          return 'shop-status-green'
        }else if( row.status == 2 ){
          return '';
        }
      },

      fetchShop( method ){
        let url, label;

        if( method === 'update' ){
          url = `/enterprises/shop/${this.idx}/update/`;
          label = '更新';
        }else if( method === 'create' ){
          url = `/enterprises/shop/create/`;
          label = '创建';
        }

        let { name, ename, phone, cantact, status, joined_time, address, location, code } = this.formValue;
        const params = {
          name,
          ename,
          phone,
          cantact,
          address,
          status,
          joined_time,
          cantact,
          code,
          province: location[ 0 ],
          city: location[ 1 ],
          district: location[ 2 ]
        }

        util.accountAxios.post( url, params )
        .then((response) => {
          const { errcode, errmsg } = response.data;
          if( !errcode ){
            this.$Message.success( `${label}店铺成功` );
            this.shopModal = false;
            if( method === 'update' ){
              this.shops.splice( this.index, 1, this.formValue );
            }else if( method === 'create' ){
              this.shops.push( this.formValue );
            }
          }else{
            this.$Message.error( errmsg )
          }
        })
      },

      dateChange( date ){
        this.date = date;
        this.time__gte = date[0];
        this.time__lte = date[1];
      },

      pageSizeChange( page_size ){
        this.page_size = page_size;
        this.fetchShops();
      },
      pageChange( page ){
        this.page = page;
        this.fetchShops();
      },

      editShop( index ){
        this.index = index;
        this.shopModal = true;
        let shop = this.shops[ index ];
        this.idx = shop.id;
        let { province, city, district } = shop;
        this.formValue = Object.assign( {}, shop );
        this.formValueCopy = Object.assign( {}, shop );
        let location = [ province, city, district ];
        this.formValue.location = [ ...location ];
        this.formValueCopy.location = [ ...location ]; 
      },

      createShop(){
        this.shopModal = true;
        this.handleReset();
      },

      editDateChange( date ){
        this.formValue.joined_time = date;
      },

      handleReset(){
        if( this.idx === -1 ){
          this.$refs.formValue.resetFields();
        }else{
          this.formValue = { ...this.formValueCopy };
        }
      },

      editShopOk(){
        if( this.idx !== -1 ){
          this.fetchShop( 'update' );  
        }else{
          this.fetchShop( 'create' );
        }
      },

      joinedChange( date ){
         this.formValue.joined_time = date ? moment( date ).valueOf() : '';
      },

      search(){
        this.fetchShops();
      }
    }
  }
</script>
<style>
  .ivu-table .shop-status-red td{
    background-color: #ff5656;
    color: #000;
  }

  .ivu-table .shop-status-green td{
    background-color: #39c361;
    color: #000;
  }

  .ivu-menu-vertical.ivu-menu-light::after{
    width: 0 !important;
  }
  .menu.ivu-menu.ivu-menu-light.ivu-menu-horizontal{
    line-height: 40px;
  }
  .menu.ivu-menu.ivu-menu-light.ivu-menu-horizontal .ivu-menu-item{
    padding: 0 8px;
    border: 1px solid #e3e8ee;
    height: 40px;
  }

  .ivu-select-item.color{
    color: #f93100;
  }
</style>
