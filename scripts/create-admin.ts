/* eslint-disable @typescript-eslint/no-explicit-any */
import { confirm, input, password } from "@inquirer/prompts"

import { auth } from "@/lib/auth/auth"

async function createSuperAdmin() {
  try {
    console.log("🚀 Create Super Admin User\n")

    const email = await input({
      message: "Enter admin email:",
      validate: value => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!value) {
          return "Email is required"
        }
        if (!emailRegex.test(value)) {
          return "Please enter a valid email address"
        }
        return true
      },
    })

    const adminPassword = await password({
      message: "Enter admin password:",
      mask: "*",
      validate: value => {
        if (!value) {
          return "Password is required"
        }
        if (value.length < 8) {
          return "Password must be at least 8 characters long"
        }
        return true
      },
    })

    await password({
      message: "Confirm admin password:",
      mask: "*",
      validate: value => {
        if (value !== adminPassword) {
          return "Passwords do not match"
        }
        return true
      },
    })

    const name = await input({
      message: "Enter admin name:",
      default: "Super Admin",
      validate: value => {
        if (!value || value.trim() === "") {
          return "Name is required"
        }
        return true
      },
    })

    const shouldCreate = await confirm({
      message: `Create admin user with email "${email}"?`,
      default: true,
    })

    if (!shouldCreate) {
      console.log("\n❌ Admin user creation cancelled")
      process.exit(0)
    }

    console.log("\n🚀 Creating super admin user...")
    console.log(`📧 Email: ${email}`)
    console.log(`👤 Name: ${name}`)

    const newUser = await auth.api.createUser({
      body: {
        email,
        password: adminPassword,
        name,
        role: "admin",
      },
    })

    console.log("\n✅ Super admin user created successfully!")
    console.log(`User ID: ${newUser.user.id}`)
    console.log(`Email: ${newUser.user.email}`)
    console.log(`Name: ${newUser.user.name}`)
    console.log(`Role: ${newUser.user.role}`)
    console.log("\n🎉 You can now login to the dashboard with these credentials.")

    process.exit(0)
  } catch (error: any) {
    console.error("\n❌ Error creating admin user:")

    if (error.message?.includes("unique") || error.message?.includes("duplicate")) {
      console.error("A user with this email already exists.")
      console.log(
        "\n💡 Tip: If you need to create a different admin, use a different email address.",
      )
    } else if (error.message) {
      console.error(error.message)
    } else {
      console.error(error)
    }

    process.exit(1)
  }
}

createSuperAdmin()
