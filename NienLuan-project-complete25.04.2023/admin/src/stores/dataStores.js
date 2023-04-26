// import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useDataStore = defineStore('data', {
  state: () => ({
    admin: [],
    Books: [
      { id: "12as", bookName: 'Pokemon', receiptPrice: 4000, author: "vvv", bookPrice: 5000, genreName: ["aaa", 'aab'], originalPrice: 5000, publisherName: "123", bookStock: 10, quantityPage: 100, size: "12x13", supplisherName: "qqq", pulicYear: "2001", bookDes: "", receiptDate: '14/02/2022' },
      { id: "12assdf", bookName: 'conan', receiptPrice: 4000, author: "ee", bookPrice: 5000, genreName: ["bbaba",], originalPrice: 5000, publisherName: "123", bookStock: 5, quantityPage: 100, size: "12x13", supplisherName: "qqq", pulicYear: "2001", bookDes: "", receiptDate: '14/02/2022' },
      { id: "12asăe", bookName: 'doremon', receiptPrice: 4000, author: "vvv", bookPrice: 5000, genreName: ['cccc'], originalPrice: 5000, publisherName: "123", bookStock: 3, quantityPage: 100, size: "12x13", supplisherName: "qqq", pulicYear: "2001", bookDes: "", receiptDate: '14/02/2022' },
      { id: "12as33", bookName: 'thieu nhi', receiptPrice: 4000, author: "fff", bookPrice: 5000, genreName: ['aab'], originalPrice: 5000, publisherName: "123", bookStock: 15, quantityPage: 100, size: "12x13", supplisherName: "qqq", pulicYear: "2001", bookDes: "", receiptDate: '14/02/2022' },
      { id: "12asád", bookName: 'toán', receiptPrice: 4000, author: "rrr", bookPrice: 5000, genreName: ["aaa", 'aab'], originalPrice: 5000, publisherName: "123", bookStock: 6, quantityPage: 100, size: "12x13", supplisherName: "qqq", pulicYear: "2001", bookDes: "", receiptDate: '14/02/2022' },
      { id: "12as3re", bookName: 'hóa', receiptPrice: 4000, author: "tt", bookPrice: 5000, genreName: ["cccc"], originalPrice: 5000, publisherName: "123", bookStock: 5, quantityPage: 100, size: "12x13", supplisherName: "qqq", pulicYear: "2001", bookDes: "", receiptDate: '14/02/2022' },
      { id: "12as3re23", bookName: 'văn', receiptPrice: 4000, bookStock: 5, supplisherName: "qqq", receiptDate: '14/02/2022' },
      { id: "12as3revv", bookName: 'sử', receiptPrice: 4000, bookStock: 5, supplisherName: "qqq", receiptDate: '14/02/2022' },],
    imgsBook: [],
    Genes: [],
    promotionList: [
      { id: "123", name: "123mmm", numberBook: 10, pricePro: 30, dateBegin: '2023-03-13T12:14', dateEnd: '2023-03-13T17:38', productList: ["12as", "12as13a"] },
      { id: "1256", name: "123mmmzzz", numberBook: 9, pricePro: 10, dateBegin: '2023-01-15T19:46', dateEnd: '2023-02-15T19:46', productList: ["12as", "12as13a"] },
      { id: "12890", name: "123mmm132", numberBook: 100, pricePro: 20, dateBegin: '2023-03-13T20:48', dateEnd: '2023-03-14T09:36', productList: ["12as", "12as13a"] },
    ],
    clientList: [
      { phone: '0101', name: 'A', address: ['12aaaaa', '22424dsacc'], sex: true, dateOfBirth: '23/2/1999', registerDate: '24/02/2022', status: true },
      { phone: '0234', name: 'B', address: ['12aaaaa', '22424dsacc'], sex: false, dateOfBirth: '23/6/1997', registerDate: '24/07/2022', status: false },
      { phone: '0101356', name: 'A', address: ['12aaaaa', '22424dsacc'], sex: true, dateOfBirth: '30/1/1999', registerDate: '24/2/2023', status: true },
      { phone: '03456', name: 'D', address: ['12aaaaa', '22424dsacc'], sex: true, dateOfBirth: '26/2/1998', registerDate: '24/2/2022', status: true },
      { phone: '05678', name: 'E', address: ['12aaaaa', '22424dsacc'], sex: true, dateOfBirth: '23/2/1999', registerDate: '24/2/2022', status: true },
      { phone: '0564421', name: 'F', address: ['12aaaaa', '22424dsacc'], sex: true, dateOfBirth: '23/2/1999', registerDate: '24/2/2022', status: true },
    ],
    supplierList: [
      { id: 'aetw12', name: 'qqq', address: "zzzzz", phone: "0010101" },
      { id: 'aetw124234', name: 'abc', address: "zzzzzsadd", phone: "00101011233" },
      { id: 'aerew', name: 'acb', address: "zzz234", phone: "00108098" },
      { id: 'aetsdas534', name: 'aab', address: "zzzzz", phone: "0979080" },
      { id: 'aetwqq23', name: 'cbd', address: "zznnn", phone: "001010199999" },
    ],
    orderList: [
      {
        id: '23awadad', orderDate: '23/11/2022', nameCustomer: 'NVA', phone: '01020230', address: '123da', orderProduct: [
          { id: '22das2', name: 'Doreamon', number: 1, price: 1000, pricePro: 900 },
          { id: '22das2ad', name: 'Doreamon2', number: 2, price: 1100, pricePro: 0 },
          { id: '22das2235', name: 'Doreamon4', number: 1, price: 1200, pricePro: 1000 },
        ], transportFee: 300, payments: 'Thanh toán khi nhận hàng', totalProduct: 4100, totalPayment: 4400, status: 'Chờ xác nhận'
      },
      {
        id: '23awaqq', orderDate: '23/12/2022', nameCustomer: 'NVB', phone: '01020567', address: '123dae5ye', orderProduct: [
          { id: '22das2', name: 'Conan', number: 1, price: 1000, pricePro: 900 },
          { id: '22das2ad', name: 'Doreamon', number: 2, price: 1100, pricePro: 0 },
        ], transportFee: 300, payments: 'Chuyển khoản', totalProduct: 3100, totalPayment: 3400, status: 'Chờ xác nhận'
      },
      {
        id: '23awa34324', orderDate: '23/12/2022', nameCustomer: 'NVC', phone: '0102056777', address: '123dae5ye', orderProduct: [
          { id: '22das2', name: 'Conan', number: 1, price: 1000, pricePro: 900 },
          { id: '22das2ad', name: 'Doreamon', number: 2, price: 1100, pricePro: 0 },
        ], transportFee: 300, payments: 'Chuyển khoản', totalProduct: 3100, totalPayment: 3400, status: 'Hoàn trả'
      },
      {
        id: '23awadadưer', orderDate: '23/10/2022', nameCustomer: 'NVE', phone: '01021111', address: '123da', orderProduct: [
          { id: '22das2', name: 'Doreamon', number: 1, price: 1000, pricePro: 900 },
          { id: '22das2ad', name: 'Doreamon2', number: 2, price: 1100, pricePro: 0 },
          { id: '22das2235', name: 'Doreamon4', number: 1, price: 1200, pricePro: 1000 },
        ], transportFee: 300, payments: 'Thanh toán khi nhận hàng', totalProduct: 4100, totalPayment: 4400, status: 'Đã hủy'
      },
      {
        id: '23awasdfsdf', orderDate: '23/12/2022', nameCustomer: 'NVB', phone: '01020567', address: '123dae5ye', orderProduct: [
          { id: '22das2', name: 'Conan', number: 1, price: 1000, pricePro: 900 },
          { id: '22das2ad', name: 'Doreamon', number: 2, price: 1100, pricePro: 0 },
        ], transportFee: 300, payments: 'Chuyển khoản', totalProduct: 3100, totalPayment: 3400, status: 'Đã nhận hàng'
      },
    ],
    receiptList: [],
    data: {},
    sales: 0,
    shipOrder: []
  }),

  getters: {
    getAdmin: state => state.admin,
    getSales: state => state.sales,
    getBooks: state => state.Books,
    getGenes: state => state.Genes,
    getPromotionList: state => state.promotionList,
    getClientList: state => state.clientList,
    getOrderList: state => state.orderList,
    getReceiptList: state => state.receiptList,
    getSupllierList: state => state.supplierList,
    getImgBook: state => state.imgsBook,
    getData: state => state.data,
    getShipOrder: state => state.shipOrder
  },

  actions: {
    setAdmin(data) {
      this.$patch((state) => {
        state.admin = data;
      })
    },
    updateBookPrice(id) {
      this.$patch((state) => {
        for (var book of state.Books) {
          if (id === book.id) {
            book.price = book.originalPrice
            book.promotionTime = null
            break;
          }
        }
      })
    },
    updateProBook(id, price, time) {
      this.$patch((state) => {
        for (var book of state.Books) {
          if (id === book.id) {
            book.price = book.price - (book.originalPrice * price / 100);
            book.promotionTime = time
            break;
          }
        }
      })
    },
    updateData(e) {
      this.$patch((state) => {
        state.data = e
      })
    },
    updateGenres(data) {
      this.$patch((state) => {
        state.Genes = data
      })
    },
    updateReceipt(data) {
      this.$patch((state) => {
        state.receiptList = data
      })
    },
    updateBooks(data) {
      this.$patch((state) => {
        state.Books = data
      })
    },
    updatePromotions(data) {
      this.$patch((state) => {
        state.promotionList = data
      })
    },
    updateClients(data) {
      this.$patch((state) => {
        state.clientList = data
      })
    },
    updateSuppliers(data) {
      this.$patch((state) => {
        state.supplierList = data
      })
    },
    updateOrders(data) {
      this.$patch((state) => {
        state.orderList = data
      })
    },
    updateImgBook(data) {
      this.$patch((state) => {
        state.imgsBook = data
      })
    },
    updateSales(data) {
      this.$patch((state) => {
        state.sales = data
      })
    },
    updateShipOrder(data) {
      this.$patch((state) => {
        state.shipOrder = data
      })
    }
  }
})
