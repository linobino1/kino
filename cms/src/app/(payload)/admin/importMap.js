import { default as default_0 } from '@/components/UrlField'
import { RichTextCell as RichTextCell_1 } from '@payloadcms/richtext-slate/client'
import { RichTextField as RichTextField_2 } from '@payloadcms/richtext-slate/client'
import { getGenerateComponentMap as getGenerateComponentMap_3 } from '@payloadcms/richtext-slate/generateComponentMap'
import { BoldLeafButton as BoldLeafButton_4 } from '@payloadcms/richtext-slate/client'
import { BoldLeaf as BoldLeaf_5 } from '@payloadcms/richtext-slate/client'
import { CodeLeafButton as CodeLeafButton_6 } from '@payloadcms/richtext-slate/client'
import { CodeLeaf as CodeLeaf_7 } from '@payloadcms/richtext-slate/client'
import { ItalicLeafButton as ItalicLeafButton_8 } from '@payloadcms/richtext-slate/client'
import { ItalicLeaf as ItalicLeaf_9 } from '@payloadcms/richtext-slate/client'
import { StrikethroughLeafButton as StrikethroughLeafButton_10 } from '@payloadcms/richtext-slate/client'
import { StrikethroughLeaf as StrikethroughLeaf_11 } from '@payloadcms/richtext-slate/client'
import { UnderlineLeafButton as UnderlineLeafButton_12 } from '@payloadcms/richtext-slate/client'
import { UnderlineLeaf as UnderlineLeaf_13 } from '@payloadcms/richtext-slate/client'
import { BlockquoteElementButton as BlockquoteElementButton_14 } from '@payloadcms/richtext-slate/client'
import { BlockquoteElement as BlockquoteElement_15 } from '@payloadcms/richtext-slate/client'
import { H1ElementButton as H1ElementButton_16 } from '@payloadcms/richtext-slate/client'
import { Heading1Element as Heading1Element_17 } from '@payloadcms/richtext-slate/client'
import { H2ElementButton as H2ElementButton_18 } from '@payloadcms/richtext-slate/client'
import { Heading2Element as Heading2Element_19 } from '@payloadcms/richtext-slate/client'
import { H3ElementButton as H3ElementButton_20 } from '@payloadcms/richtext-slate/client'
import { Heading3Element as Heading3Element_21 } from '@payloadcms/richtext-slate/client'
import { H4ElementButton as H4ElementButton_22 } from '@payloadcms/richtext-slate/client'
import { Heading4Element as Heading4Element_23 } from '@payloadcms/richtext-slate/client'
import { H5ElementButton as H5ElementButton_24 } from '@payloadcms/richtext-slate/client'
import { Heading5Element as Heading5Element_25 } from '@payloadcms/richtext-slate/client'
import { H6ElementButton as H6ElementButton_26 } from '@payloadcms/richtext-slate/client'
import { Heading6Element as Heading6Element_27 } from '@payloadcms/richtext-slate/client'
import { IndentButton as IndentButton_28 } from '@payloadcms/richtext-slate/client'
import { IndentElement as IndentElement_29 } from '@payloadcms/richtext-slate/client'
import { ListItemElement as ListItemElement_30 } from '@payloadcms/richtext-slate/client'
import { LinkButton as LinkButton_31 } from '@payloadcms/richtext-slate/client'
import { LinkElement as LinkElement_32 } from '@payloadcms/richtext-slate/client'
import { WithLinks as WithLinks_33 } from '@payloadcms/richtext-slate/client'
import { OLElementButton as OLElementButton_34 } from '@payloadcms/richtext-slate/client'
import { OrderedListElement as OrderedListElement_35 } from '@payloadcms/richtext-slate/client'
import { RelationshipButton as RelationshipButton_36 } from '@payloadcms/richtext-slate/client'
import { RelationshipElement as RelationshipElement_37 } from '@payloadcms/richtext-slate/client'
import { WithRelationship as WithRelationship_38 } from '@payloadcms/richtext-slate/client'
import { TextAlignElementButton as TextAlignElementButton_39 } from '@payloadcms/richtext-slate/client'
import { ULElementButton as ULElementButton_40 } from '@payloadcms/richtext-slate/client'
import { UnorderedListElement as UnorderedListElement_41 } from '@payloadcms/richtext-slate/client'
import { UploadElementButton as UploadElementButton_42 } from '@payloadcms/richtext-slate/client'
import { UploadElement as UploadElement_43 } from '@payloadcms/richtext-slate/client'
import { WithUpload as WithUpload_44 } from '@payloadcms/richtext-slate/client'
import { RichTextCell as RichTextCell_45 } from '@payloadcms/richtext-lexical/client'
import { RichTextField as RichTextField_46 } from '@payloadcms/richtext-lexical/client'
import { getGenerateComponentMap as getGenerateComponentMap_47 } from '@payloadcms/richtext-lexical/generateComponentMap'
import { BlocksFeatureClient as BlocksFeatureClient_48 } from '@payloadcms/richtext-lexical/client'
import { InlineToolbarFeatureClient as InlineToolbarFeatureClient_49 } from '@payloadcms/richtext-lexical/client'
import { HorizontalRuleFeatureClient as HorizontalRuleFeatureClient_50 } from '@payloadcms/richtext-lexical/client'
import { UploadFeatureClient as UploadFeatureClient_51 } from '@payloadcms/richtext-lexical/client'
import { BlockquoteFeatureClient as BlockquoteFeatureClient_52 } from '@payloadcms/richtext-lexical/client'
import { RelationshipFeatureClient as RelationshipFeatureClient_53 } from '@payloadcms/richtext-lexical/client'
import { LinkFeatureClient as LinkFeatureClient_54 } from '@payloadcms/richtext-lexical/client'
import { ChecklistFeatureClient as ChecklistFeatureClient_55 } from '@payloadcms/richtext-lexical/client'
import { OrderedListFeatureClient as OrderedListFeatureClient_56 } from '@payloadcms/richtext-lexical/client'
import { UnorderedListFeatureClient as UnorderedListFeatureClient_57 } from '@payloadcms/richtext-lexical/client'
import { IndentFeatureClient as IndentFeatureClient_58 } from '@payloadcms/richtext-lexical/client'
import { AlignFeatureClient as AlignFeatureClient_59 } from '@payloadcms/richtext-lexical/client'
import { HeadingFeatureClient as HeadingFeatureClient_60 } from '@payloadcms/richtext-lexical/client'
import { ParagraphFeatureClient as ParagraphFeatureClient_61 } from '@payloadcms/richtext-lexical/client'
import { InlineCodeFeatureClient as InlineCodeFeatureClient_62 } from '@payloadcms/richtext-lexical/client'
import { SuperscriptFeatureClient as SuperscriptFeatureClient_63 } from '@payloadcms/richtext-lexical/client'
import { SubscriptFeatureClient as SubscriptFeatureClient_64 } from '@payloadcms/richtext-lexical/client'
import { StrikethroughFeatureClient as StrikethroughFeatureClient_65 } from '@payloadcms/richtext-lexical/client'
import { UnderlineFeatureClient as UnderlineFeatureClient_66 } from '@payloadcms/richtext-lexical/client'
import { BoldFeatureClient as BoldFeatureClient_67 } from '@payloadcms/richtext-lexical/client'
import { ItalicFeatureClient as ItalicFeatureClient_68 } from '@payloadcms/richtext-lexical/client'
import { default as default_69 } from '@/collections/Mailings/fields/HtmlField'
import { default as default_70 } from '@/collections/Mailings/components/HowTo'
import { default as default_71 } from '@/components/RowLabelNavigationItem'

export const importMap = {
  "/components/UrlField#default": default_0,
  "@payloadcms/richtext-slate/client#RichTextCell": RichTextCell_1,
  "@payloadcms/richtext-slate/client#RichTextField": RichTextField_2,
  "@payloadcms/richtext-slate/generateComponentMap#getGenerateComponentMap": getGenerateComponentMap_3,
  "@payloadcms/richtext-slate/client#BoldLeafButton": BoldLeafButton_4,
  "@payloadcms/richtext-slate/client#BoldLeaf": BoldLeaf_5,
  "@payloadcms/richtext-slate/client#CodeLeafButton": CodeLeafButton_6,
  "@payloadcms/richtext-slate/client#CodeLeaf": CodeLeaf_7,
  "@payloadcms/richtext-slate/client#ItalicLeafButton": ItalicLeafButton_8,
  "@payloadcms/richtext-slate/client#ItalicLeaf": ItalicLeaf_9,
  "@payloadcms/richtext-slate/client#StrikethroughLeafButton": StrikethroughLeafButton_10,
  "@payloadcms/richtext-slate/client#StrikethroughLeaf": StrikethroughLeaf_11,
  "@payloadcms/richtext-slate/client#UnderlineLeafButton": UnderlineLeafButton_12,
  "@payloadcms/richtext-slate/client#UnderlineLeaf": UnderlineLeaf_13,
  "@payloadcms/richtext-slate/client#BlockquoteElementButton": BlockquoteElementButton_14,
  "@payloadcms/richtext-slate/client#BlockquoteElement": BlockquoteElement_15,
  "@payloadcms/richtext-slate/client#H1ElementButton": H1ElementButton_16,
  "@payloadcms/richtext-slate/client#Heading1Element": Heading1Element_17,
  "@payloadcms/richtext-slate/client#H2ElementButton": H2ElementButton_18,
  "@payloadcms/richtext-slate/client#Heading2Element": Heading2Element_19,
  "@payloadcms/richtext-slate/client#H3ElementButton": H3ElementButton_20,
  "@payloadcms/richtext-slate/client#Heading3Element": Heading3Element_21,
  "@payloadcms/richtext-slate/client#H4ElementButton": H4ElementButton_22,
  "@payloadcms/richtext-slate/client#Heading4Element": Heading4Element_23,
  "@payloadcms/richtext-slate/client#H5ElementButton": H5ElementButton_24,
  "@payloadcms/richtext-slate/client#Heading5Element": Heading5Element_25,
  "@payloadcms/richtext-slate/client#H6ElementButton": H6ElementButton_26,
  "@payloadcms/richtext-slate/client#Heading6Element": Heading6Element_27,
  "@payloadcms/richtext-slate/client#IndentButton": IndentButton_28,
  "@payloadcms/richtext-slate/client#IndentElement": IndentElement_29,
  "@payloadcms/richtext-slate/client#ListItemElement": ListItemElement_30,
  "@payloadcms/richtext-slate/client#LinkButton": LinkButton_31,
  "@payloadcms/richtext-slate/client#LinkElement": LinkElement_32,
  "@payloadcms/richtext-slate/client#WithLinks": WithLinks_33,
  "@payloadcms/richtext-slate/client#OLElementButton": OLElementButton_34,
  "@payloadcms/richtext-slate/client#OrderedListElement": OrderedListElement_35,
  "@payloadcms/richtext-slate/client#RelationshipButton": RelationshipButton_36,
  "@payloadcms/richtext-slate/client#RelationshipElement": RelationshipElement_37,
  "@payloadcms/richtext-slate/client#WithRelationship": WithRelationship_38,
  "@payloadcms/richtext-slate/client#TextAlignElementButton": TextAlignElementButton_39,
  "@payloadcms/richtext-slate/client#ULElementButton": ULElementButton_40,
  "@payloadcms/richtext-slate/client#UnorderedListElement": UnorderedListElement_41,
  "@payloadcms/richtext-slate/client#UploadElementButton": UploadElementButton_42,
  "@payloadcms/richtext-slate/client#UploadElement": UploadElement_43,
  "@payloadcms/richtext-slate/client#WithUpload": WithUpload_44,
  "@payloadcms/richtext-lexical/client#RichTextCell": RichTextCell_45,
  "@payloadcms/richtext-lexical/client#RichTextField": RichTextField_46,
  "@payloadcms/richtext-lexical/generateComponentMap#getGenerateComponentMap": getGenerateComponentMap_47,
  "@payloadcms/richtext-lexical/client#BlocksFeatureClient": BlocksFeatureClient_48,
  "@payloadcms/richtext-lexical/client#InlineToolbarFeatureClient": InlineToolbarFeatureClient_49,
  "@payloadcms/richtext-lexical/client#HorizontalRuleFeatureClient": HorizontalRuleFeatureClient_50,
  "@payloadcms/richtext-lexical/client#UploadFeatureClient": UploadFeatureClient_51,
  "@payloadcms/richtext-lexical/client#BlockquoteFeatureClient": BlockquoteFeatureClient_52,
  "@payloadcms/richtext-lexical/client#RelationshipFeatureClient": RelationshipFeatureClient_53,
  "@payloadcms/richtext-lexical/client#LinkFeatureClient": LinkFeatureClient_54,
  "@payloadcms/richtext-lexical/client#ChecklistFeatureClient": ChecklistFeatureClient_55,
  "@payloadcms/richtext-lexical/client#OrderedListFeatureClient": OrderedListFeatureClient_56,
  "@payloadcms/richtext-lexical/client#UnorderedListFeatureClient": UnorderedListFeatureClient_57,
  "@payloadcms/richtext-lexical/client#IndentFeatureClient": IndentFeatureClient_58,
  "@payloadcms/richtext-lexical/client#AlignFeatureClient": AlignFeatureClient_59,
  "@payloadcms/richtext-lexical/client#HeadingFeatureClient": HeadingFeatureClient_60,
  "@payloadcms/richtext-lexical/client#ParagraphFeatureClient": ParagraphFeatureClient_61,
  "@payloadcms/richtext-lexical/client#InlineCodeFeatureClient": InlineCodeFeatureClient_62,
  "@payloadcms/richtext-lexical/client#SuperscriptFeatureClient": SuperscriptFeatureClient_63,
  "@payloadcms/richtext-lexical/client#SubscriptFeatureClient": SubscriptFeatureClient_64,
  "@payloadcms/richtext-lexical/client#StrikethroughFeatureClient": StrikethroughFeatureClient_65,
  "@payloadcms/richtext-lexical/client#UnderlineFeatureClient": UnderlineFeatureClient_66,
  "@payloadcms/richtext-lexical/client#BoldFeatureClient": BoldFeatureClient_67,
  "@payloadcms/richtext-lexical/client#ItalicFeatureClient": ItalicFeatureClient_68,
  "/collections/Mailings/fields/HtmlField#default": default_69,
  "/collections/Mailings/components/HowTo#default": default_70,
  "/components/RowLabelNavigationItem#default": default_71
}
