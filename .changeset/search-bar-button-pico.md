---
'@govpf/ori-tailwind-preset': patch
'@govpf/ori-css': patch
---

SearchBar : corriger le « pico » disgracieux sous le coin bas-droit du bouton.

La `border-bottom` de l'underline était posée sur le wrapper `__field` qui englobe input + bouton. Comme le bouton a un `border-radius`, son coin bas-droit ne touchait pas la ligne et laissait apparaître un petit triangle disgracieux au point où la ligne quittait le radius du bouton.

On migre la `border-bottom` sur l'input lui-même : elle s'arrête net au bord droit de l'input et le bouton vit librement à côté avec son radius. Comportement de focus inchangé : le `:focus-visible` de l'input bascule la couleur sur `border-focus`.
