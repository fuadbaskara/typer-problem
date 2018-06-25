Typer Problem

Kita mencari developer yang mandiri, ketika ada masalah, aktif mencari solusi dengan sendirinya dan mudah mengerti instruksi tanpa terlalu banyak menanyakan untuk memahami instruksi.  
Berikut adalah aplikasi Javascript yang simple.  
Kami tidak akan menjelaskan bagaimana cara kerjanya atau library apa yang dipakai.

Pertanyaan:

1.  Sebutkan library apa saja yang dipakai, website library itu dimana, dan dokumentasi library itu ada dimana.
2.  Aplikasi itu 'laggy'. Kenapa? Bagaimana cara membuat animasi lebih 'smooth'?
3.  Aplikasi itu tidak akan jalan di salah satu 3 browser populer (Chrome, Firefox, Internet Explorer)? Kenapa? Solusinya hanya menghapus satu character di code, character yang mana?
4.  Implementasikan tombol Start, Stop, Pause, dan Resume.
5.  Ketika ukuran window dirubah, susunan huruf yang 'terbentur' batas window menjadi tidak 1 baris. Benarkan.
6.  Implementasikan sistem score.
7.  Implementasikan hukuman berupa pengurangan nilai bila salah ketik.

Jawaban:

1.  Library yang digunakan adalah:

a. BackboneJs :

* Website > https://backbonejs.org/
* Dokumentasi > http://backbonejs.org/

b. Bootstrap :

* Website > https://getbootstrap.com/
* Dokumentasi > https://getbootstrap.com/docs/4.1/getting-started/introduction/

c. jQuery :

* Website > https://jquery.com/
* Dokumentasi > https://api.jquery.com/

d. jQuery UI :

* Website > https://jqueryui.com
* Dokumentasi > https://api.jqueryui.com/

e. UnderscoreJs :

* Website > https://underscorejs.org/
* Dokumentasi > https://underscorejs.org/

2.  Aplikasi terasa 'laggy' dikarenakan interval antar animasi terlalu jauh, pada function start terdapat variable animation_delay secara default mempunyai value 100, jika value tersebut diperkecil maka animasa akan terasa lebih halus saat setiap pergantian pixel, misalnya set animation_delay menjadi 30, maka naimasi akan terasa jauh lebih halus dari sebelumnya.

3.  dikarenakan pada file index.html, terdapat kesalahan pengetikan pada tag `<script>` yang berguna untuk menyambungkan file html dengan library jQuery yang dipakai yaitu pada:

```
<script type="stext/javascript" src="./jquery-1.11.1.js"></script>
```

dapat dilihat didalam script ada huruf "s" sebelum kata "text" pada property type, yang seharusnya adalah :

```
<script type="text/javascript" src="./jquery-1.11.1.js"></script>
```

4.  Implementasikan tombol Start, Stop, Pause, dan Resume!
    ada pada source code typer.js

5.  Ketika ukuran window dirubah, susunan huruf yang 'terbentur' batas window menjadi tidak 1 baris. Benarkan.
    ada pada source code typer.js

6.  Implementasikan sistem score.
    ada pada source code typer.js

7.  Implementasikan hukuman berupa pengurangan nilai bila salah ketik.
    ada pada source code typer.js
