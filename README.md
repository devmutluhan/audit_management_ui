KeeenThemes Documantation
https://preview.keenthemes.com/html/good/docs/base/utilities

**ÖNERİLER**

- Onay işlemlerinde detayına gitme işlemi yapılacak
- Bildirimler sayfasında ilgili bildirimin detayına gitme işlemi yapılacak.
- Ana sayfaya zimmetlerim kartı yapılabilir. Personel kendine ait zimmetleri görür.
- Ana sayfaya personelin aktif projelerini gösteren kart yapılabilir.
- Ana sayfada yaklaşan etkinlikler şirket içi duyurular ile ilgili kart yapılabilir.
- Ana sayfada teklif onayları gösterilebilir.
- Timesheet e bağlı pasta grafiği kartı yapılabilir. Haftaya bağlı hangi işlerle meşgul olduğunu görebilir.
- Timesheet için örneğin geçen hafta salı 2 saat şu görevi yapmıştın bu hafta işlemi tekrarlamak ister misin? gibi yazılar.

**BACKEND BEKLEYENLER**

- Personel detayında İzne esas hak ediş tarihi değiştirilebilir olacak. (Yanına info yazılmalı izin hak ediş hesaplamalarını etkileyebilir diye info yazılmalı.)
- İzin alan kullanıcıya Vekil atama işlemi onay kartlarına bağlanacak ayrıca yetki meselesi düşünülecek.

**BACKEND HATALARI**

- Bildirimler ingilizce vb dillere çevrilirken template yapılması gerekli.
- Avans işlemleri bildirimlere bağlanmamış galiba
- Avans güncelleme endpointinde şu bilgiler güncellenebilir olmalı;
  {
  description: string;
  isPaid: boolean
  amount: number
  startsAt: string
  currencyCode: string
  }

**FRONTEND HATALARI**

- Profilim belgeler yapılacak.

- UpdateExpense işlemini hiç yapmamışım.
  - Bu işlemi kim hangi statuslerde yapabilir? Sadece isPaid (ödendi mi?) ve description update ediliyor. Bundan dolayı Bütün statuslerde update edilebilir olmalı mı? İşlem onay sürecindeyken isPaid true çekilirse ne olcak vb.
- UpdateAdvance işlemi yapılacak. Durum sendBack ve draft ise güncelleme yapılabilecek. Ancak isPaid meselesi düşünülmeli?
- AvatarUrl ve file işlemleri bozuldu onlar düzeltilecek.

**NOTLAR**

**MOBİL**

**YAPILMASI GEREKEN TESTLER**

**Admin Panel Analiz**

- /api/packages POST 500 dönüyor.
- /api/packages/{packageId} PUT 500 dönüyor.
- /api/packages/{packageId}/modules POST 500 dönüyor
- /api/packages controller da GET endpointleri dışında endpointler bozuk.

- /api/tenants/users GET endpointi gereksiz gibi. Bu endpointte tenantId yollamam lazım. Yolladığım id ye göre bana kullanıcıları gelmeli ve o kullanıcıları aktif-pasif-disabled falan artık hangi statuslere almamız gerekiyorsa öyle ayarlayabilmemiz lazım. Kısaca Tenant a ait bütün userları kontrol edeceğimiz controller lazım.
- /api/tenants/{tenantId}/seed 500 dönüyor. Ayrıca tam olarak ne işe yarıyor anlamadım.
- Tenant a paket ekleme endpointi gerekli. Önceden yapmıştık endpoint kayboldu. Aşağıdaki modelle ekliyorduk.
  {
  startDate = ""
  packageId = ""
  endDate = ""
  modules = new Array()
  totalPrice = 0
  userCount = 0
  }
- Ayrıca tenant a ait paketler üzerinde aktif et - pasife al gibi statuslerini güncelleyebileceğimiz endpointler lazım.
- Kısaca tenantın paketlerini kontrol altına alabileceğimiz endpointler gerekli.

**File Errors**

- // todo: fileUrl düzeltilince aşağıdaki kalkacak. bu yazıyı aratcak.

- convertToAgreement ve updateAgreement endpointlerinde agreementDocumentFileId göndermeme rağmen 
 /api/crm/agreements/{id} GET endpointinde agreementDocumentUrl bilgisi null dönüyor.
- /api/crm/agreements/{id} GET endpointinde agreementDocumentFileId prop u gelmeli. Update işlemi için gerekli.
- crm/offers POST endpointi hata veriyor. HATA: " Npgsql.PostgresException (0x80004005): 23502: null value in column "FileName" of relation "FileReferences" violates not-null constraint DETAIL: Detail redacted as it may contain sensitive data. Specify 'Include Error Detail' in the connection string to include this information..."
- /api/customers/{customerId} GET endpointi fileUrl null geliyor. Ayrıca logoId bilgisi gelmiyor. Update işlemi için gerekli.