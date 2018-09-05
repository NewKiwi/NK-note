# popup-manager
1、getModal是对modalDom的引用？如果addClass在openModal中是不是会不停地重叠？所以closeModal是中的removeClass是对这些class的清除，以免对后面的openModal产生影响？然后cloaseModal还解除了dom?

- PopupManager.modalDom一直保留着对modalDom的引用

2、instances是一类，modalStack是一类

3、nodeType 11指的是DocumentFragment, 轻量级的Document对象，能够容纳文档的某个部分
   nodeType 3 指的是Text
了解：nodeTypes


#popper
1、shadow Dom