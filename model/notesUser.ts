import mongoose, { Document, Schema } from "mongoose";

interface IContactLink {
  url: string;
  icon: string;
}

export interface INoteUser extends Document {
  name: string;
  about?: string;
  image?: string;
  contactlinks: IContactLink[];
  notes: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const noteUserSchema = new Schema<INoteUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    about: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    contactlinks: [
      {
        url: {
          type: String,
          required: true,
        },
        icon: {
          type: String,
          required: true,
        },
      },
    ],

    notes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
  },
  {
    timestamps: true,
  }
);

 const NoteUser = mongoose.model<INoteUser>("NoteUser",noteUserSchema);

export default NoteUser;


