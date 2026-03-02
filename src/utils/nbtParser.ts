import * as pako from "pako";

export type NBTValue =
  | number
  | bigint
  | string
  | NBTValue[]
  | { [key: string]: NBTValue }
  | number[];

/**
 * Parser NBT minimalista para ler arquivos binários do Minecraft no navegador.
 */
class NBTReader {
  private view: DataView;
  private offset: number = 0;
  private decoder = new TextDecoder("utf-8");

  constructor(buffer: ArrayBuffer) {
    this.view = new DataView(buffer);
  }

  readByte(): number {
    return this.view.getInt8(this.offset++);
  }

  readShort(): number {
    const val = this.view.getInt16(this.offset);
    this.offset += 2;
    return val;
  }

  readInt(): number {
    const val = this.view.getInt32(this.offset);
    this.offset += 4;
    return val;
  }

  readLong(): bigint {
    const val = this.view.getBigInt64(this.offset);
    this.offset += 8;
    return val;
  }

  readFloat(): number {
    const val = this.view.getFloat32(this.offset);
    this.offset += 4;
    return val;
  }

  readDouble(): number {
    const val = this.view.getFloat64(this.offset);
    this.offset += 8;
    return val;
  }

  readString(): string {
    const length = this.view.getUint16(this.offset);
    this.offset += 2;
    const bytes = new Uint8Array(
      this.view.buffer,
      this.view.byteOffset + this.offset,
      length,
    );
    this.offset += length;
    return this.decoder.decode(bytes);
  }

  readTag(type: number): NBTValue {
    switch (type) {
      case 1:
        return this.readByte();
      case 2:
        return this.readShort();
      case 3:
        return this.readInt();
      case 4:
        return Number(this.readLong());
      case 5:
        return this.readFloat();
      case 6:
        return this.readDouble();
      case 7: {
        // Byte Array
        const length = this.readInt();
        const arr = new Int8Array(
          this.view.buffer,
          this.view.byteOffset + this.offset,
          length,
        );
        this.offset += length;
        return Array.from(arr);
      }
      case 8:
        return this.readString();
      case 9: {
        // List
        const subType = this.readByte();
        const length = this.readInt();
        const list = [];
        for (let i = 0; i < length; i++) {
          list.push(this.readTag(subType));
        }
        return list;
      }
      case 10: {
        // Compound
        const compound: Record<string, NBTValue> = {};
        while (true) {
          const type = this.readByte();
          if (type === 0) break;
          const name = this.readString();
          compound[name] = this.readTag(type);
        }
        return compound;
      }
      case 11: {
        // Int Array
        const length = this.readInt();
        const arr = [];
        for (let i = 0; i < length; i++) arr.push(this.readInt());
        return arr;
      }
      case 12: {
        // Long Array
        const length = this.readInt();
        const arr = [];
        for (let i = 0; i < length; i++) arr.push(Number(this.readLong()));
        return arr;
      }
      default:
        throw new Error(`Tag desconhecida ${type}`);
    }
  }

  parse(): NBTValue {
    const type = this.readByte();
    if (type !== 10)
      throw new Error("O arquivo NBT deve comecar com um Compound Tag");
    this.readString(); // Ignora o nome da tag raiz
    return this.readTag(10);
  }
}

export async function parseNbtFile(
  file: File,
): Promise<Record<string, NBTValue>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) {
        reject(new Error("Falha ao ler o arquivo"));
        return;
      }

      try {
        const buffer = e.target.result as ArrayBuffer;
        let uint8 = new Uint8Array(buffer);

        // Descompressão GZIP
        if (uint8[0] === 0x1f && uint8[1] === 0x8b) {
          try {
            uint8 = pako.ungzip(uint8);
          } catch (err) {
            console.error("Erro GZIP:", err);
          }
        }

        const nbtReader = new NBTReader(
          uint8.buffer.slice(
            uint8.byteOffset,
            uint8.byteOffset + uint8.byteLength,
          ),
        );
        const data = nbtReader.parse();

        // Normalização para o Dashboard
        // O level.dat geralmente tem uma tag raiz chamada "Data"
        const resultData = data as Record<string, NBTValue>;
        if (resultData.Data) {
          resolve({ Data: resultData.Data });
        } else {
          resolve({ Data: resultData });
        }
      } catch (err) {
        console.error("Erro no Parse NBT:", err);
        reject(
          new Error(
            "Erro ao processar o arquivo NBT binario Verifique se o arquivo esta corrompido",
          ),
        );
      }
    };

    reader.onerror = () => reject(new Error("Erro de leitura no FileReader"));
    reader.readAsArrayBuffer(file);
  });
}
