// tina/config.ts
import { defineConfig } from "tinacms";
var branch = "master";
var clientId = process.env.NEXT_PUBLIC_TINA_CLIENT_ID;
var token = process.env.TINA_TOKEN;
var config_default = defineConfig({
  branch,
  // Get this from tina.io
  clientId,
  // Get this from tina.io
  token,
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public"
    }
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "page",
        label: "Pages",
        path: "content/pages",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "string",
            name: "slug",
            label: "URL Slug",
            required: true
          },
          {
            type: "boolean",
            name: "published",
            label: "Published",
            required: true
          },
          {
            type: "datetime",
            name: "createdAt",
            label: "Created At",
            ui: {
              dateFormat: "MMMM DD YYYY",
              timeFormat: "hh:mm A"
            }
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
            templates: [
              {
                name: "Hero",
                label: "Hero Section",
                fields: [
                  {
                    name: "title",
                    label: "Title",
                    type: "string"
                  },
                  {
                    name: "subtitle",
                    label: "Subtitle",
                    type: "string"
                  },
                  {
                    name: "backgroundImage",
                    label: "Background Image",
                    type: "image"
                  }
                ]
              },
              {
                name: "CallToAction",
                label: "Call to Action",
                fields: [
                  {
                    name: "text",
                    label: "Button Text",
                    type: "string"
                  },
                  {
                    name: "link",
                    label: "Button Link",
                    type: "string"
                  },
                  {
                    name: "style",
                    label: "Button Style",
                    type: "string",
                    options: ["primary", "secondary", "outline"]
                  }
                ]
              }
            ]
          }
        ],
        ui: {
          // This is an DEMO router. You can remove this to fit your site
          router: ({ document }) => `/pages/${document._sys.filename}`
        }
      },
      {
        name: "menuItem",
        label: "Menu Items",
        path: "content/menu",
        fields: [
          {
            type: "string",
            name: "name",
            label: "Item Name",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "number",
            name: "price",
            label: "Price",
            required: true
          },
          {
            type: "string",
            name: "category",
            label: "Category",
            options: ["pizza", "salad", "appetizer", "dessert", "beverage"],
            required: true
          },
          {
            type: "image",
            name: "image",
            label: "Image"
          },
          {
            type: "boolean",
            name: "featured",
            label: "Featured Item"
          },
          {
            type: "boolean",
            name: "available",
            label: "Available",
            required: true
          },
          {
            type: "object",
            name: "nutritionInfo",
            label: "Nutrition Information",
            fields: [
              {
                type: "number",
                name: "calories",
                label: "Calories"
              },
              {
                type: "number",
                name: "protein",
                label: "Protein (g)"
              },
              {
                type: "number",
                name: "carbs",
                label: "Carbohydrates (g)"
              },
              {
                type: "number",
                name: "fat",
                label: "Fat (g)"
              }
            ]
          },
          {
            type: "string",
            name: "allergens",
            label: "Allergens",
            list: true,
            options: ["gluten", "dairy", "nuts", "shellfish", "eggs", "soy"]
          }
        ]
      },
      {
        name: "settings",
        label: "Site Settings",
        path: "content/settings",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false
          }
        },
        fields: [
          {
            type: "string",
            name: "siteName",
            label: "Site Name",
            required: true
          },
          {
            type: "string",
            name: "tagline",
            label: "Tagline"
          },
          {
            type: "image",
            name: "logo",
            label: "Logo"
          },
          {
            type: "string",
            name: "description",
            label: "Site Description",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "object",
            name: "contact",
            label: "Contact Information",
            fields: [
              {
                type: "string",
                name: "phone",
                label: "Phone Number"
              },
              {
                type: "string",
                name: "email",
                label: "Email"
              },
              {
                type: "string",
                name: "address",
                label: "Address",
                ui: {
                  component: "textarea"
                }
              }
            ]
          },
          {
            type: "object",
            name: "hours",
            label: "Operating Hours",
            fields: [
              {
                type: "string",
                name: "monday",
                label: "Monday"
              },
              {
                type: "string",
                name: "tuesday",
                label: "Tuesday"
              },
              {
                type: "string",
                name: "wednesday",
                label: "Wednesday"
              },
              {
                type: "string",
                name: "thursday",
                label: "Thursday"
              },
              {
                type: "string",
                name: "friday",
                label: "Friday"
              },
              {
                type: "string",
                name: "saturday",
                label: "Saturday"
              },
              {
                type: "string",
                name: "sunday",
                label: "Sunday"
              }
            ]
          },
          {
            type: "object",
            name: "social",
            label: "Social Media",
            fields: [
              {
                type: "string",
                name: "facebook",
                label: "Facebook URL"
              },
              {
                type: "string",
                name: "instagram",
                label: "Instagram URL"
              },
              {
                type: "string",
                name: "twitter",
                label: "Twitter URL"
              }
            ]
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
