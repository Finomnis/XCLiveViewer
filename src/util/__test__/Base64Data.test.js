import { decodeBase64, encodeBase64 } from "../Base64Data";
import * as wtf8 from "wtf-8";

function test_enc_dec(data) {
  const encodedData = encodeBase64(data);
  //console.log(encodedData);
  /*
  console.log(
    "Size: ",
    encodedData.length,
    " / ",
    btoa(wtf8.encode(JSON.stringify(data))).length
  );
  */

  const decodedData = decodeBase64(encodedData);
  expect(decodedData).toEqual(data);
}

it("Base64Data", () => {
  test_enc_dec({
    Tala: "Michal Talavasek",
    Pfyl: "René Pfyl",
    Whistler: "Lionel Buzzetti",
    miromatejka: "Miroslav Matejka",
    HAndras: "Andras Herceg",
    winz79: "Sebastien WITZ",
    cowboy81090: "Clement AZAM",
    KonradW: "Konrad Warzolek",
    odraciR: "Ricardo Fernandez",
    Danieldelcasti: "Daniel del Castillo",
    Heke: "Hermanni Keinänen",
    icaroaccordi: "Icaro Accordi",
    "air3-44489": "air3-44489 44489",
    alexpab: "Alessandro De Vivo",
    "petr.musil": "Petr Musil",
    smoq90: "Ondřej Zábojník",
    carlosmiranda: "Carlos Miranda",
    gattou: "Sylvain Gattini",
    chefkoch84: "Maximilian Koch",
    "jan.pa": "Jan Paták",
    lmiturbe: "Luis Martinez Iturbe",
    ropston: "Robert Niziolek",
    EduardoVidaurre: "Eduardo Vidaurre",
    snowman1638: "Tony HO",
  });
  test_enc_dec({
    "a:b": 10,
    b: "Hello world!©",
    d: "Meine kleine Maus!",
    c: [1, 2],
  });
  test_enc_dec(["a", "b", "c"]);
});
