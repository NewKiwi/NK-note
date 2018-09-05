#
- drop-shadow滤镜的应用

# 问题
在nuxt中v-for中使用会报错
vue.runtime.esm.js:6037 Mismatching childNodes vs. VNodes:

vue.runtime.esm.js:587 [Vue warn]: The client-side rendered virtual DOM tree is not matching server-rendered content. This is likely caused by incorrect HTML markup, for example nesting block-level elements inside <p>, or missing <tbody>. Bailing hydration and performing full client-side render

已经比较过结尾标签

- 因为P标签中使用了div