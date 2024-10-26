import { default as default_0 } from '@/components/UrlField'
import { RichTextCell as RichTextCell_1 } from '@payloadcms/richtext-lexical/client'
import { RichTextField as RichTextField_2 } from '@payloadcms/richtext-lexical/client'
import { getGenerateComponentMap as getGenerateComponentMap_3 } from '@payloadcms/richtext-lexical/generateComponentMap'
import { InlineToolbarFeatureClient as InlineToolbarFeatureClient_4 } from '@payloadcms/richtext-lexical/client'
import { HorizontalRuleFeatureClient as HorizontalRuleFeatureClient_5 } from '@payloadcms/richtext-lexical/client'
import { UploadFeatureClient as UploadFeatureClient_6 } from '@payloadcms/richtext-lexical/client'
import { BlockquoteFeatureClient as BlockquoteFeatureClient_7 } from '@payloadcms/richtext-lexical/client'
import { RelationshipFeatureClient as RelationshipFeatureClient_8 } from '@payloadcms/richtext-lexical/client'
import { LinkFeatureClient as LinkFeatureClient_9 } from '@payloadcms/richtext-lexical/client'
import { ChecklistFeatureClient as ChecklistFeatureClient_10 } from '@payloadcms/richtext-lexical/client'
import { OrderedListFeatureClient as OrderedListFeatureClient_11 } from '@payloadcms/richtext-lexical/client'
import { UnorderedListFeatureClient as UnorderedListFeatureClient_12 } from '@payloadcms/richtext-lexical/client'
import { IndentFeatureClient as IndentFeatureClient_13 } from '@payloadcms/richtext-lexical/client'
import { AlignFeatureClient as AlignFeatureClient_14 } from '@payloadcms/richtext-lexical/client'
import { HeadingFeatureClient as HeadingFeatureClient_15 } from '@payloadcms/richtext-lexical/client'
import { ParagraphFeatureClient as ParagraphFeatureClient_16 } from '@payloadcms/richtext-lexical/client'
import { InlineCodeFeatureClient as InlineCodeFeatureClient_17 } from '@payloadcms/richtext-lexical/client'
import { SuperscriptFeatureClient as SuperscriptFeatureClient_18 } from '@payloadcms/richtext-lexical/client'
import { SubscriptFeatureClient as SubscriptFeatureClient_19 } from '@payloadcms/richtext-lexical/client'
import { StrikethroughFeatureClient as StrikethroughFeatureClient_20 } from '@payloadcms/richtext-lexical/client'
import { UnderlineFeatureClient as UnderlineFeatureClient_21 } from '@payloadcms/richtext-lexical/client'
import { BoldFeatureClient as BoldFeatureClient_22 } from '@payloadcms/richtext-lexical/client'
import { ItalicFeatureClient as ItalicFeatureClient_23 } from '@payloadcms/richtext-lexical/client'
import { BlocksFeatureClient as BlocksFeatureClient_24 } from '@payloadcms/richtext-lexical/client'
import { default as default_25 } from '@/collections/Mailings/fields/HtmlField'
import { default as default_26 } from '@/collections/Mailings/components/HowTo'
import { OverviewComponent as OverviewComponent_27 } from '@payloadcms/plugin-seo/client'
import { MetaTitleComponent as MetaTitleComponent_28 } from '@payloadcms/plugin-seo/client'
import { MetaDescriptionComponent as MetaDescriptionComponent_29 } from '@payloadcms/plugin-seo/client'
import { MetaImageComponent as MetaImageComponent_30 } from '@payloadcms/plugin-seo/client'
import { PreviewComponent as PreviewComponent_31 } from '@payloadcms/plugin-seo/client'
import { default as default_32 } from '@/components/MagicSlugsExplanation'
import { default as default_33 } from '@/components/RowLabelNavigationItem'
import { default as default_34 } from '@/components/MigrateMovieLink'
import { default as default_35 } from '@/views/tmdb-migrate/index'

export const importMap = {
  "@/components/UrlField#default": default_0,
  "@payloadcms/richtext-lexical/client#RichTextCell": RichTextCell_1,
  "@payloadcms/richtext-lexical/client#RichTextField": RichTextField_2,
  "@payloadcms/richtext-lexical/generateComponentMap#getGenerateComponentMap": getGenerateComponentMap_3,
  "@payloadcms/richtext-lexical/client#InlineToolbarFeatureClient": InlineToolbarFeatureClient_4,
  "@payloadcms/richtext-lexical/client#HorizontalRuleFeatureClient": HorizontalRuleFeatureClient_5,
  "@payloadcms/richtext-lexical/client#UploadFeatureClient": UploadFeatureClient_6,
  "@payloadcms/richtext-lexical/client#BlockquoteFeatureClient": BlockquoteFeatureClient_7,
  "@payloadcms/richtext-lexical/client#RelationshipFeatureClient": RelationshipFeatureClient_8,
  "@payloadcms/richtext-lexical/client#LinkFeatureClient": LinkFeatureClient_9,
  "@payloadcms/richtext-lexical/client#ChecklistFeatureClient": ChecklistFeatureClient_10,
  "@payloadcms/richtext-lexical/client#OrderedListFeatureClient": OrderedListFeatureClient_11,
  "@payloadcms/richtext-lexical/client#UnorderedListFeatureClient": UnorderedListFeatureClient_12,
  "@payloadcms/richtext-lexical/client#IndentFeatureClient": IndentFeatureClient_13,
  "@payloadcms/richtext-lexical/client#AlignFeatureClient": AlignFeatureClient_14,
  "@payloadcms/richtext-lexical/client#HeadingFeatureClient": HeadingFeatureClient_15,
  "@payloadcms/richtext-lexical/client#ParagraphFeatureClient": ParagraphFeatureClient_16,
  "@payloadcms/richtext-lexical/client#InlineCodeFeatureClient": InlineCodeFeatureClient_17,
  "@payloadcms/richtext-lexical/client#SuperscriptFeatureClient": SuperscriptFeatureClient_18,
  "@payloadcms/richtext-lexical/client#SubscriptFeatureClient": SubscriptFeatureClient_19,
  "@payloadcms/richtext-lexical/client#StrikethroughFeatureClient": StrikethroughFeatureClient_20,
  "@payloadcms/richtext-lexical/client#UnderlineFeatureClient": UnderlineFeatureClient_21,
  "@payloadcms/richtext-lexical/client#BoldFeatureClient": BoldFeatureClient_22,
  "@payloadcms/richtext-lexical/client#ItalicFeatureClient": ItalicFeatureClient_23,
  "@payloadcms/richtext-lexical/client#BlocksFeatureClient": BlocksFeatureClient_24,
  "/collections/Mailings/fields/HtmlField#default": default_25,
  "/collections/Mailings/components/HowTo#default": default_26,
  "@payloadcms/plugin-seo/client#OverviewComponent": OverviewComponent_27,
  "@payloadcms/plugin-seo/client#MetaTitleComponent": MetaTitleComponent_28,
  "@payloadcms/plugin-seo/client#MetaDescriptionComponent": MetaDescriptionComponent_29,
  "@payloadcms/plugin-seo/client#MetaImageComponent": MetaImageComponent_30,
  "@payloadcms/plugin-seo/client#PreviewComponent": PreviewComponent_31,
  "@/components/MagicSlugsExplanation#default": default_32,
  "/components/RowLabelNavigationItem#default": default_33,
  "/components/MigrateMovieLink#default": default_34,
  "/views/tmdb-migrate/index#default": default_35
}
