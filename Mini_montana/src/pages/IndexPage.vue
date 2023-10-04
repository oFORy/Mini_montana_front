<template>
  <q-page class="flex flex-start justify-center page">
    <div class="column items-center full-width ">
      <img
        alt="Logo"
        @click="clear()"
        src="~assets/logo_montana.png"
        style="width: 36px; height: 50px"
      >
    </div>

    <div v-if="currentCurrency === null" class="column full-width" style="gap: 1em">      
      <div class="grid_two_column">
        <q-btn color="primary" size="lg" :to="{name: 'FaqPage'}" label="FAQ"></q-btn>
        <q-btn color="primary" size="lg" :to="{name: 'HelpPage'}" label="Поддержка"></q-btn>
      </div>

      <div>
        <q-select square 
              rounded 
              standout 
              v-model="country"
              size="lg"    
              bg-color="primary" 
              label-color="white"         
              map-options
              emit-value
              option-value="id"
              option-label="value" 
              input-class="select-style"
              :options="countyOptions" 
              @update:model-value="sortCurrencys()"
              label="Выбор страны">
              <template v-slot:prepend>
                <q-icon color="white" name="language"></q-icon>
              </template>
            </q-select>
      </div>

      <div class="column" style="gap: 1em;">
        <div>
          <span class="fs-lg text-white font-inter-bold">Валюта</span>
        </div>

        <div class="grid_three_column">

          <div v-for="currency in currencys" :key="currency" @click="currentCurrency = currency" class="currency__grid">
            <div class="currency__icon">
              <img
                :alt="currency?.label"
                :src="currency?.imageUrl"
              >
            </div>
            <div class="row items-center justify-center">
              <span class="text-white font-inter-regular">{{ currency?.shortLabel }}</span>
            </div>
          </div>
        </div>
      </div>
      
    </div>

    <div v-if="currentCurrency !== null" class="column full-width" style="gap: 0.5em"> 
      <div class="currency__name">
        <img
          alt="Logo"
          :src="currentCurrency?.imageUrl"
        >
        <div>
          <span class="fs-lg text-white font-inter-bold">{{ currentCurrency?.label }} ({{ currentCurrency?.shortLabel }})</span>
        </div>
      </div>
      <span class="text-white font-inter-bold fs-lg" style="color: #BEBEBE !important">Описание</span>
      <span class="text-white fs-md" style="padding-bottom: 8px;">{{ currentCurrency?.description }}</span>

      <q-btn color="primary" size="xl" @click="checkDialogOpen(1)" label="Доставка"></q-btn>
      <q-btn color="primary" size="xl" @click="checkDialogOpen(2)" label="Офис"></q-btn>
      <q-btn color="primary" size="xl" @click="timeDialogOpen(3)" label="Выбрать время"></q-btn>
    </div>

    <q-dialog v-model="checkShow">
      <q-card class="dialog-base">
        <q-card-section>
          <div class="fs-lg text-white font-inter-bold">Кошелёк для перевода</div>
          <div class="row items-center">
            <span class="text-white fs-xxs">{{ currentCurrency?.walletNumber }}</span>
            <q-btn round flat dense @click="copy(currentCurrency?.walletNumber)">
              <q-icon :name="'content_copy'" color="white" size="xs" class="cursor-pointer"></q-icon>
            </q-btn>
          </div>
        </q-card-section>
        <q-card-section>
          <q-btn :disable="file !== null" class="file_btn" type="file" icon="add" unelevated rounded ref="fileInputRef" color="button" text-color="white" size="md" label="Прикрепите скриншот чека об оплате" @click="onPickFile()"></q-btn>
          <input
            type="file"
            style="display: none"
            ref="fileInput"
            @change="onFilePicked"/>
        </q-card-section>
        <q-card-section class="row items-center justify-center">
          <q-btn color="primary" :disable="file === null" size="md" @click="createAction()" label="Отправить"></q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="timeShow">
      <q-card class="dialog-base">
        <q-card-section>
          <div class="text-h6 text-white">Выберите время</div>
        </q-card-section>
        <q-card-section class="row" style="gap:10px">
          <q-input v-model="date" dark color="text-white" bg-color="primary" rounded standout type="date"></q-input>
          <q-input v-model="time" dark color="text-white" bg-color="primary" rounded standout type="time"></q-input>
        </q-card-section>
        <q-card-section class="row items-center justify-center">
          <q-btn color="primary" :disable="date === null && time === null" size="md" @click="checkDialogOpen(3)" label="Далее"></q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { date, Notify, useQuasar, Platform, copyToClipboard } from "quasar";
import { api } from 'boot/axios'

export default defineComponent({
  name: 'IndexPage',

  data() {
    return {
      country: 1,
      countyOptions: [
        { id: 1, value: 'Испания'},
        { id: 2, value: 'Франция'},
        { id: 3, value: 'ОАЭ'},
        { id: 4, value: 'Мексика'},
      ],
      allCurrencys: [],
      currencys: [],
      currentCurrency: null,
      checkShow: false,
      timeShow: false,
      actionId: null,
      file: null,

      date: null,
      time: null
      
    }
  },

  mounted() {
    // window.Telegram.WebApp.MainButton.setText('Разработать')
    // window.Telegram.WebApp.MainButton.show()
    // const f = () => this.clickMainButtonAllCategory()
    // window.Telegram.WebApp.MainButton.onClick(f)
    this.getCurrencys();
  },

  methods: {
    getCurrencys: async function () {
      this.loading = true
      await api
        .get('Api/Data/GetCurrencys')
        .then((response) => {
          if (response) {
            this.allCurrencys = response.data
            this.sortCurrencys();
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      this.loading = false
    },

    sortCurrencys() {
      // this.currencys = this.allCurrencys.filter(f=>f.countries.find(ff=>ff.id === this.country) !== null)
      this.currencys = this.allCurrencys.filter(item => {
        return item.countries.some(country => country.id === this.country);
      });
    },

    checkDialogOpen(actionId) {
      this.actionId = actionId;
      this.checkShow = true;
      this.timeShow = false;
    },
    timeDialogOpen(actionId) {
      this.actionId = actionId;
      this.checkShow = false;
      this.timeShow = true;
    },

    async createAction () {
      const init = window.Telegram?.WebApp.initDataUnsafe      
      let combinedDateTime = '';
      if(this.date !== null) {
        // combinedDateTime = this.parseDate(this.date, this.time);
        combinedDateTime = this.date
        if(this.time !== null) combinedDateTime += ' ' + this.time
      }
      let combinedName = null; 
      if(init?.user?.first_name !== null) {
        combinedName = init?.user?.first_name
        if(init?.user?.last_name !== null) combinedName += ' ' + init?.user?.last_name
      }

      var countryName = this.countyOptions.find(x=>x.id===this.country)
      
      var actionName;
      switch (this.actionId) {
        case 1:
          actionName = "Выбрана - Доставка"
          break;
        case 2:
          actionName = "Выбран - Офис"
          break;
        case 3:
          actionName = "Выбрано - Время"
          break;
      
        default:
          break;
      }

      var formData = new FormData();
      formData.append("UserName", combinedName ?? null);
      formData.append('UserLogin', init?.user?.username ?? null);
      formData.append('UserId', init?.user?.id ?? null);
      formData.append('SelectedDateTime', combinedDateTime ?? null);
      formData.append('CurrencyId', this.currentCurrency?.id);
      formData.append('CurrencyName', this.currentCurrency?.label);
      formData.append('ActionType', this.actionId);
      formData.append('ActionTypeName', actionName);
      formData.append('CountryId', this.country);
      formData.append('CountryName', countryName?.value);
      formData.append('Files', this.file);

      await api
        .post('Api/Data/DataCollected', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }})
        .then((response) => {
          // window.Telegram?.WebApp.close()
          this.clear();
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    clear() {
      this.checkShow = false;
      this.timeShow = false;
      this.currentCurrency = null;
      this.date = null;
      this.time = null;
      this.file = null;
    },
    parseDate(date, time) {
      const [year, month, day] = date.split('-').map(Number);
      const [hour, minute] = time.split(':').map(Number);
      const parsedDate = new Date(year, month - 1, day, hour, minute);
      return parsedDate;
    },

    copy(data) {
      copyToClipboard(data);
      Notify.create({
        message: 'Номер кошелька скопирован!'
      });
    },
    onPickFile () {
      this.$refs.fileInput.click()
    },
    onFilePicked (event) {
      let files = Array.from(event.target.files)
      files.forEach(file => {
        this.file = file
      });
    },
  }
})
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 1em;
}
.dialog-base {
  background-color: #1E1E1E;
  border-radius: 12px;
  width: 100%;
}
.grid_two_column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1em;
}
.grid_three_column {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1em;
}
.currency__icon {
  background-color: #393939;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.currency__grid {
  display: grid;
  grid-template-rows: 5fr 1fr;
  gap: 1em;
}

.file_btn {
  width: 300px;
  height: 300px;
  border: 5px dashed white;
}
.currency__name {
  gap: 10px;
  padding-bottom: 8px;
  display: grid;
  grid-template-columns: 1fr 8fr;
  align-items: center;
}
:deep(.q-field__native) {
  color: white;
}

:deep(.q-btn-item) {
  border-radius: 12px;
}
:deep(.q-field__control) {
  border-radius: 12px !important;
  color: white;
}
:deep(.q-select__dropdown-icon) {
  color: white;
}
:deep(.q-btn__content) {
  font-family: InterBold;
  display: flex;
    align-content: center;
    gap: 1em;
}
:deep(.q-field__native) {
  font-family: InterRegular;
}
</style>
