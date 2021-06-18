import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
let productModal = '';
let delproductModal = '';

createApp({
    data(){
        return{
            apiUrl='https://vue3-course-api.hexschool.io/',
            apiPath:'vueliveclass',
            produts: [],
            isNew: false,
            tempProduct:{
                imagesUrl: [],
            },
        }
    },

    methods(){
        productModal = new bootsrap.Modal(document.getElementById('productModal'),{
            keyboard: false
        });
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'),{
            keyboard: false
        });

        //take Token
        const Token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        if (Token === ''){
        alert('尚未登入 請重新登入');
        window.location= 'login.html';
        }
        axios.defaults.headers.common.Authorization = token;
        this.getData();
    },
    methods:{
        getData(page = 1){
            const Url =`${this.apiUrl}/${this.apiPath}/admin/products?page=${page}`;
            axios.get(Url).then((res) =>{
                if (res.data.success){
                    this.data.products = res.data.products;
                }else{
                    alert(res.data.message);
                    window.location = 'login.html';
                }
        })
    },
    updateProduct(){
        let Url = `${this.apiUrl}/${this.apiPath}/admin/product`;
        let http = 'post';
        
        if(!this.isNew){
            url = `${this.apiUrl}/${this.apiPath}/admin/product/${this.tempProduct.id}`;
            http = 'put'
        }
        axios[http](url, {data:this.tempProduct}).then((res) => {
            if(res.data.success){
                alert(res.data.message);
                productModal.hide();
                this.getData();
            }else{
                alert(res.data.message);
            }
        })
    },
    openModel(isNew, item){
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
                delproductModal.show()
            }
        },
        delProduct() {
            const Url = `${this.apiUrl}/${this.apiPath}/admin/product/${this.tempProduct.id}`;
            axios.delete(Url).then((res)=>{
                if(res.data.success){
                    alert(res.data.success);
                    delProductModal.hide();
                    this.getData();
                }else {
                    alert(res.data.message);
                }
            });
        },
        createImages(){
            this.tempProduct.imagesUrl= [];
            this.tempProduct.imagesUrl.push('');
        },
    },
    
}).mount('#app');