import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

let productModal = null;
let delProductModal = null;

createApp({
    data() {
      return {
        apiUrl: 'https://vue3-course-api.hexschool.io/api',
        apiPath: 'vueliveclass',
        products: [],
        isNew: false,
        tempProduct: {
          imagesUrl: [],
        },
      }
    },

    mounted() {
        productModal = new bootstrap.Modal(document.getElementById('productModal'));
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));

        //take Token
        const Token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        if (Token === ''){
        alert('尚未登入 請重新登入');
        window.location= 'index.html';
        }
        axios.defaults.headers.common.Authorization = Token;
        this.getData();
    },
    methods: {
        getData(page=1){
            const Url =`${this.apiUrl}/${this.apiPath}/admin/products?page=${page}`;
            axios.get(Url).then((res) =>{
                if (res.data.success){
                    this.products = res.data.products;
                }else{
                    alert(res.data.message);
                    window.location = 'index.html';
                }
        })
        .catch((error) =>{
            console.log(error);
        })
    },
    updateProduct(){
        let Url = `${this.apiUrl}/${this.apiPath}/admin/product`;
        let http = 'post';
        
        if(!this.isNew){
            Url = `${this.apiUrl}/${this.apiPath}/admin/product/${this.tempProduct.id}`;
            http = 'put'
        }
        axios[http](Url, {data:this.tempProduct}).then((res) => {
            if(res.data.success){
                alert(res.data.message);
                productModal.hide();
                this.getData();
            }else{
                alert(res.data.message);
            }
        })
    },
    openModal(isNew, item){
        if(isNew === 'new') {
            this.tempProduct = {
              imagesUrl: [],
            };
            this.isNew = true;
            productModal.show();
            }else if (isNew === 'edit') {
                this.tempProduct = {...item};
                this.isNew = false;
                productModal.show();
            }else if(isNew === 'delete'){
                this.tempProduct = {...item};
                delProductModal.show()
            }
        },
        delProduct() {
            const Url = `${this.apiUrl}/${this.apiPath}/admin/product/${this.tempProduct.id}`;
            axios.delete(Url).then((res)=>{
                if(res.data.success){
                    alert(res.data.message);
                    delProductModal.hide();
                    this.getData();
                }else {
                    alert("錯誤");
                }
            }).catch((err) =>{
                console.log(err);
            })
        },
        createImages(){
            this.tempProduct.imagesUrl= [];
            this.tempProduct.imagesUrl.push('');
        },
    },
    
}).mount('#app');