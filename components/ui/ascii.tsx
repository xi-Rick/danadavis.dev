'use client'
import type React from 'react'
import { useEffect } from 'react'

const asciiArt = `
                                                                                                                                                                   
                                                                                                                                                                   
DDDDDDDDDDDDD                                                                 DDDDDDDDDDDDD                                                 iiii                   
D::::::::::::DDD                                                              D::::::::::::DDD                                             i::::i                  
D:::::::::::::::DD                                                            D:::::::::::::::DD                                            iiii                   
DDD:::::DDDDD:::::D                                                           DDD:::::DDDDD:::::D                                                                  
  D:::::D    D:::::D  aaaaaaaaaaaaa  nnnn  nnnnnnnn      aaaaaaaaaaaaa          D:::::D    D:::::D  aaaaaaaaaaaaavvvvvvv           vvvvvvviiiiiii     ssssssssss   
  D:::::D     D:::::D a::::::::::::a n:::nn::::::::nn    a::::::::::::a         D:::::D     D:::::D a::::::::::::av:::::v         v:::::v i:::::i   ss::::::::::s  
  D:::::D     D:::::D aaaaaaaaa:::::an::::::::::::::nn   aaaaaaaaa:::::a        D:::::D     D:::::D aaaaaaaaa:::::av:::::v       v:::::v   i::::i ss:::::::::::::s 
  D:::::D     D:::::D          a::::ann:::::::::::::::n           a::::a        D:::::D     D:::::D          a::::a v:::::v     v:::::v    i::::i s::::::ssss:::::s
  D:::::D     D:::::D   aaaaaaa:::::a  n:::::nnnn:::::n    aaaaaaa:::::a        D:::::D     D:::::D   aaaaaaa:::::a  v:::::v   v:::::v     i::::i  s:::::s  ssssss 
  D:::::D     D:::::D aa::::::::::::a  n::::n    n::::n  aa::::::::::::a        D:::::D     D:::::D aa::::::::::::a   v:::::v v:::::v      i::::i    s::::::s      
  D:::::D     D:::::Da::::aaaa::::::a  n::::n    n::::n a::::aaaa::::::a        D:::::D     D:::::Da::::aaaa::::::a    v:::::v:::::v       i::::i       s::::::s   
  D:::::D    D:::::Da::::a    a:::::a  n::::n    n::::na::::a    a:::::a        D:::::D    D:::::Da::::a    a:::::a     v:::::::::v        i::::i ssssss   s:::::s 
DDD:::::DDDDD:::::D a::::a    a:::::a  n::::n    n::::na::::a    a:::::a      DDD:::::DDDDD:::::D a::::a    a:::::a      v:::::::v        i::::::is:::::ssss::::::s
D:::::::::::::::DD  a:::::aaaa::::::a  n::::n    n::::na:::::aaaa::::::a      D:::::::::::::::DD  a:::::aaaa::::::a       v:::::v         i::::::is::::::::::::::s 
D::::::::::::DDD     a::::::::::aa:::a n::::n    n::::n a::::::::::aa:::a     D::::::::::::DDD     a::::::::::aa:::a       v:::v          i::::::i s:::::::::::ss  
DDDDDDDDDDDDD         aaaaaaaaaa  aaaa nnnnnn    nnnnnn  aaaaaaaaaa  aaaa     DDDDDDDDDDDDD         aaaaaaaaaa  aaaa        vvv           iiiiiiii  sssssssssss    
                                                                                                                                                                   
                                                                                                                                                                   
                                                                                                                                                                   
                                                                                                                                                                   
                                                                                                                                                                   
                                                                                                                                                                   
                                                                                                                                                                   
`

const Ascii: React.FC = () => {
  useEffect(() => {
    console.log(asciiArt)
  }, [])

  return null // Or render something if needed
}

export default Ascii
