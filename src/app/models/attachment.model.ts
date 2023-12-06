export class AttachmentModel {
  name: string;
  blob: string;

  constructor(name: string, blob: string) {
    this.name = name;
    this.blob = blob;
  }
}
