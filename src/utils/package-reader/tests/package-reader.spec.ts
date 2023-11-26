import * as path from "path";
import { getReader, DirectoryReader, ZipReader } from "..";

describe("PackageReader", () => {
  const assetsPath = path.join(__dirname, "assets");

  it("getReader should return a DirectoryReader", async () => {
    const reader = await getReader(path.join(assetsPath, "myDir"));
    expect(reader).toBeInstanceOf(DirectoryReader);
  });
  it("getReader should return a ZipReader", async () => {
    const reader = await getReader(path.join(assetsPath, "myZip.zip"));
    expect(reader).toBeInstanceOf(ZipReader);
  });
  it("getReader should throw, not found", () => {
    expect(() => getReader(path.join(assetsPath, "nothing"))).rejects.toThrow();
  });

  const objs = [
    {
      name: "DirectoryReader",
      objPath: path.join(assetsPath, "myDir"),
    },
    {
      name: "ZipReader",
      objPath: path.join(assetsPath, "myZip.zip"),
    },
  ];
  for (const obj of objs) {
    describe(`${obj.name} methods`, () => {
      it("exists method", async () => {
        const reader = await getReader(obj.objPath);
        expect(await reader.exists("myfile.txt")).toBe(true);
        expect(await reader.exists("nothing.txt")).toBe(false);
        expect(await reader.exists("subDir/mySecondFile.md")).toBe(true);
      });

      it("isDirectory method", async () => {
        const reader = await getReader(obj.objPath);
        expect(await reader.isDirectory("myfile.txt")).toBe(false);
        expect(await reader.isDirectory("subDir")).toBe(true);
        expect(reader.isDirectory("nothing.txt")).rejects.toThrow();
        expect(await reader.isDirectory("subDir/mySecondFile.md")).toBe(false);
      });

      it("isFile method", async () => {
        const reader = await getReader(obj.objPath);
        expect(await reader.isFile("myfile.txt")).toBe(true);
        expect(await reader.isFile("subDir")).toBe(false);
        expect(reader.isFile("nothing.txt")).rejects.toThrow();
        expect(await reader.isFile("subDir/mySecondFile.md")).toBe(true);
      });

      it("read method, simple txt", async () => {
        const reader = await getReader(obj.objPath);
        expect(await reader.read("myfile.txt", true)).toBe("Hello World!\n");
        expect(await reader.read("myfile.txt")).toBe("Hello World!\n");
      });

      it("read method, simple txt, as buffer", async () => {
        const reader = await getReader(obj.objPath);
        const buffer = await reader.read("myfile.txt", false);
        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.toString()).toBe("Hello World!\n");
      });

      it("read method, subFile", async () => {
        const reader = await getReader(obj.objPath);
        const buffer = await reader.read("subDir/mySecondFile.md", false);
        expect(buffer).toBeInstanceOf(Buffer);
        expect(buffer.toString()).toBe("Oula\n");
      });
    });
  }
});
