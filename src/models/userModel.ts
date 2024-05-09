import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose'

@modelOptions({
  schemaOptions: { timestamps: true },
})
export class User {
  public _id?: string

  @prop({ required: true, unique: true })
  public email!: string

  @prop({ required: true })
  public password!: string

  @prop({ required: true })
  public confirmPassword!: string

  @prop()
  public newPassword?: string
}

export const UserModel = getModelForClass(User)
